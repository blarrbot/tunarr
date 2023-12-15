import { EntityDTO, Loaded, wrap } from '@mikro-orm/core';
import { FfmpegSettings, Program } from 'dizquetv-types';
import { first, isEmpty, isNil, isUndefined, pick } from 'lodash-es';
import * as randomJS from 'random-js';
import { DeepReadonly } from 'ts-essentials';
import { ChannelCache } from './channelCache.js';
import constants from './constants.js';
import { Watermark, offlineProgram } from './dao/db.js';
import { Channel } from './dao/entities/Channel.js';
import { ChannelFillerShow } from './dao/entities/ChannelFillerShow.js';
import { Program as ProgramEntity } from './dao/entities/Program.js';
import {
  CHANNEL_CONTEXT_KEYS,
  ContextChannel,
  LineupItem,
  Maybe,
  Nullable,
} from './types.js';

const SLACK = constants.SLACK;
const Random = randomJS.Random;
export const random = new Random(randomJS.MersenneTwister19937.autoSeed());

// Figure out this type later...
export type ProgramAndTimeElapsed = {
  program: DeepReadonly<Program> & { err?: Error };
  timeElapsed: number;
  programIndex: number;
};

export function getCurrentProgramAndTimeElapsed(
  time: number,
  channel: Loaded<Channel, 'programs'>,
): ProgramAndTimeElapsed {
  if (channel.startTime > time) {
    const t0 = time;
    const t1 = channel.startTime;
    console.log(
      'Channel start time is above the given date. Flex time is picked till that.',
    );
    return {
      program: offlineProgram(t1 - t0),
      timeElapsed: 0,
      programIndex: -1,
    };
  }
  let timeElapsed =
    (time - channel.startTime) % channel.duration.asMilliseconds();
  let currentProgramIndex = -1;
  for (let y = 0, l2 = channel.programs.$.length; y < l2; y++) {
    const program = channel.programs[y];
    if (timeElapsed - program.durationMs < 0) {
      currentProgramIndex = y;
      // I'm pretty sure this allows for a little skew in
      // the start time of the next show
      if (
        program.durationMs > 2 * SLACK &&
        timeElapsed > program.durationMs - SLACK
      ) {
        timeElapsed = 0;
        currentProgramIndex = (y + 1) % channel.programs.length;
      }
      break;
    } else {
      timeElapsed -= program.durationMs;
    }
  }

  if (currentProgramIndex === -1) {
    throw new Error('No program found; find algorithm fucked up');
  }

  return {
    program: channel.programs[currentProgramIndex].toDTO(),
    timeElapsed: timeElapsed,
    programIndex: currentProgramIndex,
  };
}

// TODO: This only ever returns a single-element array - fix the return type to simplify things
// The naming is also kinda terrible - maybe it changed over time? This function seems to do one of:
// 1. If the current item is an error item, return it with the time remaining until next up
// 2. If the current program is "offline" type, try to pick best fitting content among fillter
// 2b. If no fillter content is found, then pad with more offline time
// 3. Return the currently playing "real" program
export async function createLineup(
  channelCache: ChannelCache,
  obj: ProgramAndTimeElapsed,
  channel: Loaded<Channel, 'programs'>,
  fillers: Loaded<ChannelFillerShow, 'fillerShow' | 'fillerShow.content'>[],
  isFirst: boolean,
): Promise<LineupItem[]> {
  let timeElapsed = obj.timeElapsed;
  // Start time of a file is never consistent unless 0. Run time of an episode can vary.
  // When within 30 seconds of start time, just make the time 0 to smooth things out
  // Helps prevents losing first few seconds of an episode upon lineup change
  const activeProgram = obj.program;
  let beginningOffset = 0;

  const lineup: LineupItem[] = [];

  if (!isUndefined(activeProgram.err)) {
    const remaining = activeProgram.duration - timeElapsed;
    lineup.push({
      type: 'offline',
      title: 'Error',
      err: activeProgram.err,
      streamDuration: remaining,
      duration: remaining,
      start: 0,
      beginningOffset: beginningOffset,
    });
    return lineup;
  }

  if (activeProgram.isOffline === true) {
    //offline case
    let remaining = activeProgram.duration - timeElapsed;
    //look for a random filler to play
    let filler: Nullable<EntityDTO<ProgramEntity>>;
    let fallbackProgram: Nullable<EntityDTO<ProgramEntity>> = null;

    // See if we have any fallback programs set
    await channel.fallback.init();
    if (channel.offline.mode === 'clip' && channel.fallback?.length != 0) {
      fallbackProgram = wrap(first(channel.fallback)!).toJSON();
    }

    // Pick a random filler, too
    const randomResult = pickRandomWithMaxDuration(
      channelCache,
      channel,
      fillers,
      remaining + (isFirst ? 7 * 24 * 60 * 60 * 1000 : 0),
    );
    filler = randomResult.filler;

    // Cap the filler at remaining time
    if (isNil(filler) && remaining > randomResult.minimumWait) {
      remaining = randomResult.minimumWait;
    }

    // If we could not find a configured filler program, try to use the
    // fallback.
    let isSpecial = false;
    if (isNil(filler)) {
      filler = fallbackProgram;
      isSpecial = true;
    }

    if (!isNil(filler)) {
      let fillerstart = 0;
      // If we have a special, push it on the lineup
      if (isSpecial) {
        if (filler.durationMs > remaining) {
          fillerstart = filler.durationMs - remaining;
        } else {
          fillerstart = 0;
        }

        // Otherwise, if we're dealing with the first item in the lineup,
      } else if (isFirst) {
        fillerstart = Math.max(0, filler.durationMs - remaining);
        //it's boring and odd to tune into a channel and it's always
        //the start of a commercial.
        const more = Math.max(
          0,
          filler.durationMs - fillerstart - 15000 - SLACK,
        );
        fillerstart += random.integer(0, more);
      }

      lineup.push({
        // just add the video, starting at 0, playing the entire duration
        type: 'commercial',
        title: filler.title,
        key: filler.externalKey,
        // plexFile: filler.plexFile!,
        plexFile: '', // When is this used
        file: filler.filePath!,
        ratingKey: filler.plexRatingKey!,
        start: fillerstart,
        streamDuration: Math.max(
          1,
          Math.min(filler.durationMs - fillerstart, remaining),
        ),
        duration: filler.durationMs,
        fillerId: filler.uuid,
        beginningOffset: beginningOffset,
        serverKey: filler.externalSourceId,
      });

      return lineup;
    }
    // pick the offline screen
    remaining = Math.min(remaining, 10 * 60 * 1000);
    //don't display the offline screen for longer than 10 minutes. Maybe the
    //channel's admin might change the schedule during that time and then
    //it would be better to start playing the content.
    lineup.push({
      type: 'offline',
      title: 'Channel Offline',
      streamDuration: remaining,
      beginningOffset: beginningOffset,
      duration: remaining,
      start: 0,
    });
    return lineup;
  }
  const originalTimeElapsed = timeElapsed;
  if (timeElapsed < 30000) {
    timeElapsed = 0;
  }
  beginningOffset = Math.max(0, originalTimeElapsed - timeElapsed);

  return [
    {
      type: 'program',
      title: activeProgram.title!,
      key: activeProgram.key!,
      plexFile: activeProgram.plexFile!,
      file: activeProgram.file!,
      ratingKey: activeProgram.ratingKey!,
      start: timeElapsed,
      streamDuration: activeProgram.duration - timeElapsed,
      beginningOffset: beginningOffset,
      duration: activeProgram.duration,
      serverKey: activeProgram.serverKey!,
    },
  ];
}

function weighedPick(a: number, total: number) {
  return random.bool(a, total);
}

// Exported for debugging purposes only
export function pickRandomWithMaxDuration(
  channelCache: ChannelCache,
  channel: Channel,
  fillers: Loaded<ChannelFillerShow, 'fillerShow' | 'fillerShow.content'>[],
  maxDuration: number,
): {
  fillerId: Nullable<string>;
  filler: Nullable<EntityDTO<ProgramEntity>>;
  minimumWait: number;
} {
  if (isEmpty(fillers)) {
    return {
      fillerId: null,
      filler: null,
      minimumWait: Number.MAX_SAFE_INTEGER,
    };
  }

  let fillerPrograms = fillers.reduce(
    (o, x) => [...o, ...x.fillerShow.content.$.toArray()],
    [] as EntityDTO<Loaded<ProgramEntity, never>>[],
  );

  let pick1: Maybe<EntityDTO<Loaded<ProgramEntity, never>>>;
  const t0 = new Date().getTime();
  let minimumWait = 1000000000;
  const D = 7 * 24 * 60 * 60 * 1000;
  const E = 5 * 60 * 60 * 1000;
  let fillerRepeatCooldownMs = 0;
  if (isUndefined(channel.fillerRepeatCooldown)) {
    fillerRepeatCooldownMs = 30 * 60 * 1000;
  }

  let listM = 0;
  let fillerId: Maybe<string> = undefined;
  for (let j = 0; j < fillers.length; j++) {
    fillerPrograms = fillers[j].fillerShow.content.$.toArray();
    let pickedList = false;
    let n = 0;

    for (let i = 0; i < fillerPrograms.length; i++) {
      const clip = fillerPrograms[i];
      // a few extra milliseconds won't hurt anyone, would it? dun dun dun
      if (clip.durationMs <= maxDuration + SLACK) {
        const t1 = channelCache.getProgramLastPlayTime(channel.number, {
          serverKey: clip.externalSourceId,
          key: clip.externalKey,
        });
        let timeSince = t1 == 0 ? D : t0 - t1;

        if (timeSince < fillerRepeatCooldownMs - SLACK) {
          const w = fillerRepeatCooldownMs - timeSince;
          if (clip.durationMs + w <= maxDuration + SLACK) {
            minimumWait = Math.min(minimumWait, w);
          }
          timeSince = 0;
          //30 minutes is too little, don't repeat it at all
        } else if (!pickedList) {
          const t1 = channelCache.getFillerLastPlayTime(
            channel.number,
            fillers[j].fillerShow.uuid,
          );
          const timeSince = t1 == 0 ? D : t0 - t1;
          if (timeSince + SLACK >= fillers[j].cooldown.asSeconds()) {
            //should we pick this list?
            listM += fillers[j].weight;
            if (weighedPick(fillers[j].weight, listM)) {
              pickedList = true;
              fillerId = fillers[j].fillerShow.uuid;
              n = 0;
            } else {
              break;
            }
          } else {
            const w = fillers[j].cooldown.asSeconds() - timeSince;
            if (clip.durationMs + w <= maxDuration + SLACK) {
              minimumWait = Math.min(minimumWait, w);
            }

            break;
          }
        }
        if (timeSince <= 0) {
          continue;
        }
        const s = norm_s(timeSince >= E ? E : timeSince);
        const d = norm_d(clip.durationMs);
        const w = s + d;
        n += w;
        if (weighedPick(w, n)) {
          pick1 = clip;
        }
      }
    }
  }

  return {
    fillerId: fillerId!,
    filler: isNil(pick1)
      ? null
      : {
          ...pick1,
          // fillerId: fillerId,
          durationMs: pick1.durationMs,
        },
    minimumWait: minimumWait,
  };
}

function norm_d(x: number) {
  x /= 60 * 1000;
  if (x >= 3.0) {
    x = 3.0 + Math.log(x);
  }
  const y = 10000 * (Math.ceil(x * 1000) + 1);
  return Math.ceil(y / 1000000) + 1;
}

function norm_s(x: number) {
  let y = Math.ceil(x / 600) + 1;
  y = y * y;
  return Math.ceil(y / 1000000) + 1;
}

// any channel thing used here should be added to channel context
export function getWatermark(
  ffmpegSettings: FfmpegSettings,
  channel: ContextChannel,
  type: string,
): Maybe<Watermark> {
  if (
    !ffmpegSettings.enableTranscoding ||
    ffmpegSettings.disableChannelOverlay
  ) {
    return;
  }

  let disableFillerOverlay = channel.disableFillerOverlay;
  if (isUndefined(disableFillerOverlay)) {
    disableFillerOverlay = true;
  }

  if (type == 'commercial' && disableFillerOverlay) {
    return;
  }

  let icon: Maybe<string>;
  let watermark: Maybe<Watermark>;
  if (!isUndefined(channel.watermark)) {
    watermark = { ...channel.watermark };
    if (!watermark.enabled) {
      return;
    }

    icon = watermark.url;
    if (isUndefined(icon) || icon === '') {
      icon = channel.icon?.path;
      if (isUndefined(icon) || icon === '') {
        return;
      }
    }

    return {
      enabled: true,
      url: icon,
      width: watermark.width,
      verticalMargin: watermark.verticalMargin,
      horizontalMargin: watermark.horizontalMargin,
      duration: watermark.duration,
      position: watermark.position,
      fixedSize: watermark.fixedSize === true,
      animated: watermark.animated === true,
    };
  }

  return;
}

export function generateChannelContext(
  channel: Loaded<Channel, 'programs'>,
): ContextChannel {
  return pick(channel, CHANNEL_CONTEXT_KEYS as ReadonlyArray<keyof Channel>);
}
