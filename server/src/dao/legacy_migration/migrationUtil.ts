import { ProgramType, Resolution } from '@tunarr/types';
import { every, isNaN, isUndefined, parseInt } from 'lodash-es';
import { LegacyProgram } from './LegacyChannelMigrator.js';
import { v4 } from 'uuid';
import { Maybe } from '../../types/util.js';
import { isNonEmptyString } from '../../util/index.js';
import { ProgramSourceType } from '../custom_types/ProgramSourceType.js';
import { Program, programTypeFromString } from '../entities/Program.js';

// JSON representation for easier parsing of legacy db files
export interface JSONArray extends Array<JSONValue> {}
export interface JSONObject extends Record<string, JSONValue> {}
export type JSONValue =
  | string
  | number
  | undefined
  | boolean
  | JSONObject
  | JSONArray;

export function tryParseResolution(
  s: string | undefined,
): Resolution | undefined {
  if (isUndefined(s)) {
    return undefined;
  }

  const parts = s.split('x', 2);
  if (parts.length < 2) {
    return undefined;
  }

  const x = parseInt(parts[0]);
  const y = parseInt(parts[1]);

  if (isNaN(x) || isNaN(y)) {
    return undefined;
  }

  return {
    widthPx: x,
    heightPx: y,
  };
}

export function tryStringSplitOrDefault(
  s: string | undefined,
  delim: string,
  defaultValue: string[],
): string[] {
  return s?.split(delim) ?? defaultValue;
}

export function uniqueProgramId<
  T extends {
    serverKey?: string;
    ratingKey?: string;
  },
>(program: T): string {
  return `${program.serverKey!}|${program.ratingKey!}`;
}

export function convertRawProgram(program: JSONObject): LegacyProgram {
  const programType = program['type'] as string | undefined;
  const isMovie = programType === 'movie';
  const id = v4();
  const outProgram: LegacyProgram = {
    id,
    duration: program['duration'] as number,
    episodeIcon: program['episodeIcon'] as Maybe<string>,
    file: program['file'] as string,
    icon: program['icon'] as string,
    key: program['key'] as string,
    plexFile: program['plexFile'] as string,
    ratingKey: program['ratingKey'] as string,
    serverKey: program['serverKey'] as string,
    showTitle: program['showTitle'] as Maybe<string>,
    summary: program['summary'] as string,
    title: program['title'] as string,
    type: program['type'] as ProgramType,
    episode: isMovie ? undefined : (program['episode'] as Maybe<number>),
    season: isMovie ? undefined : (program['season'] as Maybe<number>),
    seasonIcon: isMovie ? undefined : (program['seasonIcon'] as Maybe<string>),
    // showId: program['showId'] as string,
    showIcon: isMovie ? undefined : (program['showIcon'] as Maybe<string>),
    date: program['date'] as string,
    rating: program['rating'] as string,
    year: program['year'] as number,
    channel: program['channel'] as number,
    isOffline: (program['isOffline'] as Maybe<boolean>) ?? false,
    customOrder: program['customOrder'] as Maybe<number>,
    customShowId: program['customShowId'] as Maybe<string>,
    customShowName: program['customShowName'] as Maybe<string>,
    sourceType: 'plex',
  };

  return outProgram;
}

export function createProgramEntity(program: LegacyProgram) {
  if (
    ['movie', 'episode', 'track'].includes(program.type ?? '') &&
    every([program.ratingKey, program.serverKey, program.key], isNonEmptyString)
  ) {
    const dbProgram = new Program();
    dbProgram.duration = program.duration;
    dbProgram.sourceType = ProgramSourceType.PLEX;
    dbProgram.episode = program.episode;
    dbProgram.filePath = program.file;
    dbProgram.icon = program.icon;
    dbProgram.externalKey = program.ratingKey!;
    dbProgram.plexRatingKey = program.key!;
    dbProgram.plexFilePath = program.plexFile;
    dbProgram.externalSourceId = program.serverKey!;
    dbProgram.showTitle = program.showTitle;
    dbProgram.summary = program.summary;
    dbProgram.title = program.title!;
    // This is checked above
    dbProgram.type = programTypeFromString(program.type)!;
    dbProgram.episode = program.episode;
    dbProgram.seasonNumber = program.season;
    dbProgram.seasonIcon = program.seasonIcon;
    dbProgram.showIcon = program.showIcon;
    dbProgram.originalAirDate = program.date;
    dbProgram.rating = program.rating;
    dbProgram.year = program.year;
    return dbProgram;
  }

  return;
}
