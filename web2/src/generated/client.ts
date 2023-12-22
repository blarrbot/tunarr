import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const createChannelV2_Body = z.object({
  number: z.number(),
  name: z.string(),
  startTime: z.number(),
  watermark: z
    .object({
      url: z.string().optional(),
      enabled: z.boolean(),
      position: z.string(),
      width: z.number(),
      verticalMargin: z.number(),
      horizontalMargin: z.number(),
      duration: z.number(),
      fixedSize: z.boolean(),
      animated: z.boolean(),
    })
    .optional(),
  icon: z.object({
    path: z.string(),
    width: z.number(),
    duration: z.number(),
    position: z.string(),
  }),
  guideMinimumDurationSeconds: z.number().optional().default(300),
  groupTitle: z.string().optional().default('dizqueTV'),
  disableFillerOverlay: z.boolean().optional(),
  offline: z
    .object({
      picture: z.string().optional(),
      soundtrack: z.string().optional(),
      mode: z.union([z.literal('pic'), z.literal('clip')]),
    })
    .optional()
    .default({ mode: 'pic' }),
  stealth: z.boolean().optional(),
  guideFlexPlaceholder: z.string().optional(),
  duration: z.number().optional(),
});
const batchGetProgramsByExternalIds_Body = z.object({
  externalIds: z.array(z.string()),
});

export const schemas = {
  createChannelV2_Body,
  batchGetProgramsByExternalIds_Body,
};

const endpoints = makeApi([
  {
    method: 'delete',
    path: '/api/cache/images/',
    alias: 'deleteApicacheimages',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'delete',
    path: '/api/channel',
    alias: 'deleteApichannel',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'post',
    path: '/api/channel-tools/random-slots',
    alias: 'postApichannelToolsrandomSlots',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'post',
    path: '/api/channel-tools/time-slots',
    alias: 'postApichannelToolstimeSlots',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/channel/:number',
    alias: 'getApichannelNumber',
    requestFormat: 'json',
    parameters: [
      {
        name: 'number',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/channel/description/:number',
    alias: 'getApichanneldescriptionNumber',
    requestFormat: 'json',
    parameters: [
      {
        name: 'number',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/channel/programless/:number',
    alias: 'getApichannelprogramlessNumber',
    requestFormat: 'json',
    parameters: [
      {
        name: 'number',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/channel/programs/:number',
    alias: 'getApichannelprogramsNumber',
    requestFormat: 'json',
    parameters: [
      {
        name: 'number',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.array(
      z.object({
        channel: z.number().optional(),
        customOrder: z.number().optional(),
        customShowId: z.string().optional(),
        customShowName: z.string().optional(),
        date: z.string().optional(),
        duration: z.number(),
        episode: z.number().optional(),
        episodeIcon: z.string().optional(),
        file: z.string().optional(),
        id: z.string(),
        icon: z.string().optional(),
        isOffline: z.boolean(),
        key: z.string().optional(),
        plexFile: z.string().optional(),
        rating: z.string().optional(),
        ratingKey: z.string().optional(),
        season: z.number().optional(),
        seasonIcon: z.string().optional(),
        serverKey: z.string().optional(),
        showIcon: z.string().optional(),
        showTitle: z.string().optional(),
        summary: z.string().optional(),
        title: z.string().optional(),
        type: z.union([
          z.literal('movie'),
          z.literal('episode'),
          z.literal('track'),
          z.literal('redirect'),
          z.literal('custom'),
          z.literal('flex'),
        ]),
        year: z.number().optional(),
      }),
    ),
  },
  {
    method: 'get',
    path: '/api/channelNumbers',
    alias: 'getApichannelNumbers',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/channels',
    alias: 'getApichannels',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/channels.m3u',
    alias: 'getApichannels_m3u',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/events',
    alias: 'getApievents',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/ffmpeg-settings',
    alias: 'getApiffmpegSettings',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'put',
    path: '/api/ffmpeg-settings',
    alias: 'putApiffmpegSettings',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'post',
    path: '/api/ffmpeg-settings',
    alias: 'postApiffmpegSettings',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'put',
    path: '/api/filler',
    alias: 'putApifiller',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/filler/:id',
    alias: 'getApifillerId',
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'post',
    path: '/api/filler/:id',
    alias: 'postApifillerId',
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'delete',
    path: '/api/filler/:id',
    alias: 'deleteApifillerId',
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/filler/:id/channels',
    alias: 'getApifillerIdchannels',
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/fillers',
    alias: 'getApifillers',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/guide/channels',
    alias: 'getApiguidechannels',
    requestFormat: 'json',
    parameters: [
      {
        name: 'dateFrom',
        type: 'Query',
        schema: z.string().datetime({ offset: true }),
      },
      {
        name: 'dateTo',
        type: 'Query',
        schema: z.string().datetime({ offset: true }),
      },
    ],
    response: z.record(
      z.object({
        icon: z
          .object({
            path: z.string(),
            width: z.number(),
            duration: z.number(),
            position: z.string(),
          })
          .optional(),
        name: z.string().optional(),
        number: z.number().optional(),
        programs: z.array(
          z.object({
            start: z.string(),
            stop: z.string(),
            summary: z.string().optional(),
            date: z.string().optional(),
            rating: z.string().optional(),
            icon: z.string().optional(),
            title: z.string(),
            sub: z
              .object({
                season: z.number(),
                episode: z.number(),
                title: z.string(),
              })
              .partial()
              .optional(),
            programDuration: z.number().optional(),
          }),
        ),
      }),
    ),
  },
  {
    method: 'get',
    path: '/api/guide/channels/:number',
    alias: 'getApiguidechannelsNumber',
    requestFormat: 'json',
    parameters: [
      {
        name: 'number',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/guide/debug',
    alias: 'getApiguidedebug',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/guide/status',
    alias: 'getApiguidestatus',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/hdhr-settings',
    alias: 'getApihdhrSettings',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'put',
    path: '/api/hdhr-settings',
    alias: 'putApihdhrSettings',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'post',
    path: '/api/hdhr-settings',
    alias: 'postApihdhrSettings',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/plex',
    alias: 'getApiplex',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/plex-servers',
    alias: 'getApiplexServers',
    requestFormat: 'json',
    response: z.unknown(),
    errors: [
      {
        status: 500,
        description: `Default Response`,
        schema: z.string(),
      },
    ],
  },
  {
    method: 'delete',
    path: '/api/plex-servers',
    alias: 'deleteApiplexServers',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'put',
    path: '/api/plex-servers',
    alias: 'putApiplexServers',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'post',
    path: '/api/plex-servers',
    alias: 'postApiplexServers',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'post',
    path: '/api/plex-servers/foreignstatus',
    alias: 'postApiplexServersforeignstatus',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'post',
    path: '/api/plex-servers/status',
    alias: 'postApiplexServersstatus',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/plex-settings',
    alias: 'getApiplexSettings',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'put',
    path: '/api/plex-settings',
    alias: 'putApiplexSettings',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'post',
    path: '/api/plex-settings',
    alias: 'postApiplexSettings',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'put',
    path: '/api/show',
    alias: 'putApishow',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/show/:id',
    alias: 'getApishowId',
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'post',
    path: '/api/show/:id',
    alias: 'postApishowId',
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'delete',
    path: '/api/show/:id',
    alias: 'deleteApishowId',
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/shows',
    alias: 'getApishows',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'post',
    path: '/api/upload/image',
    alias: 'postApiuploadimage',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/v1/debug/helpers/create_lineup',
    alias: 'getApiv1debughelperscreate_lineup',
    requestFormat: 'json',
    parameters: [
      {
        name: 'channel',
        type: 'Query',
        schema: z.number(),
      },
      {
        name: 'live',
        type: 'Query',
        schema: z.boolean().optional(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/v1/debug/helpers/current_program',
    alias: 'getApiv1debughelperscurrent_program',
    requestFormat: 'json',
    parameters: [
      {
        name: 'channel',
        type: 'Query',
        schema: z.number(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/v1/debug/helpers/random_filler',
    alias: 'getApiv1debughelpersrandom_filler',
    requestFormat: 'json',
    parameters: [
      {
        name: 'channel',
        type: 'Query',
        schema: z.number(),
      },
      {
        name: 'live',
        type: 'Query',
        schema: z.boolean().optional(),
      },
      {
        name: 'maxDuration',
        type: 'Query',
        schema: z.number(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/v1/debug/plex',
    alias: 'getApiv1debugplex',
    requestFormat: 'json',
    parameters: [
      {
        name: 'channel',
        type: 'Query',
        schema: z.number(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/v1/debug/plex-transcoder/video-stats',
    alias: 'getApiv1debugplexTranscodervideoStats',
    requestFormat: 'json',
    parameters: [
      {
        name: 'channel',
        type: 'Query',
        schema: z.number(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/v1/jobs',
    alias: 'getApiv1jobs',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/v2/channels',
    alias: 'getChannelsV2',
    requestFormat: 'json',
    response: z.array(
      z.object({
        number: z.number(),
        watermark: z
          .object({
            url: z.string().optional(),
            enabled: z.boolean(),
            position: z.string(),
            width: z.number(),
            verticalMargin: z.number(),
            horizontalMargin: z.number(),
            duration: z.number(),
            fixedSize: z.boolean(),
            animated: z.boolean(),
          })
          .optional(),
        fillerCollections: z
          .array(
            z.object({
              id: z.string(),
              weight: z.number(),
              cooldownSeconds: z.number(),
            }),
          )
          .optional(),
        programs: z.array(
          z.object({
            channel: z.number().optional(),
            customOrder: z.number().optional(),
            customShowId: z.string().optional(),
            customShowName: z.string().optional(),
            date: z.string().optional(),
            duration: z.number(),
            episode: z.number().optional(),
            episodeIcon: z.string().optional(),
            file: z.string().optional(),
            id: z.string(),
            icon: z.string().optional(),
            isOffline: z.boolean(),
            key: z.string().optional(),
            plexFile: z.string().optional(),
            rating: z.string().optional(),
            ratingKey: z.string().optional(),
            season: z.number().optional(),
            seasonIcon: z.string().optional(),
            serverKey: z.string().optional(),
            showIcon: z.string().optional(),
            showTitle: z.string().optional(),
            summary: z.string().optional(),
            title: z.string().optional(),
            type: z.union([
              z.literal('movie'),
              z.literal('episode'),
              z.literal('track'),
              z.literal('redirect'),
              z.literal('custom'),
              z.literal('flex'),
            ]),
            year: z.number().optional(),
          }),
        ),
        icon: z.object({
          path: z.string(),
          width: z.number(),
          duration: z.number(),
          position: z.string(),
        }),
        guideMinimumDurationSeconds: z.number(),
        groupTitle: z.string(),
        disableFillerOverlay: z.boolean(),
        startTime: z.number(),
        offline: z.object({
          picture: z.string().optional(),
          soundtrack: z.string().optional(),
          mode: z.union([z.literal('pic'), z.literal('clip')]),
        }),
        name: z.string(),
        transcoding: z
          .object({
            targetResolution: z.object({
              widthPx: z.number(),
              heightPx: z.number(),
            }),
            videoBitrate: z.number().optional(),
            videoBufferSize: z.number().optional(),
          })
          .optional(),
        duration: z.number(),
        fallback: z
          .array(
            z.object({
              channel: z.number().optional(),
              customOrder: z.number().optional(),
              customShowId: z.string().optional(),
              customShowName: z.string().optional(),
              date: z.string().optional(),
              duration: z.number(),
              episode: z.number().optional(),
              episodeIcon: z.string().optional(),
              file: z.string().optional(),
              id: z.string(),
              icon: z.string().optional(),
              isOffline: z.boolean(),
              key: z.string().optional(),
              plexFile: z.string().optional(),
              rating: z.string().optional(),
              ratingKey: z.string().optional(),
              season: z.number().optional(),
              seasonIcon: z.string().optional(),
              serverKey: z.string().optional(),
              showIcon: z.string().optional(),
              showTitle: z.string().optional(),
              summary: z.string().optional(),
              title: z.string().optional(),
              type: z.union([
                z.literal('movie'),
                z.literal('episode'),
                z.literal('track'),
                z.literal('redirect'),
                z.literal('custom'),
                z.literal('flex'),
              ]),
              year: z.number().optional(),
            }),
          )
          .optional(),
        stealth: z.boolean(),
        guideFlexPlaceholder: z.string().optional(),
        fillerRepeatCooldown: z.number().optional(),
      }),
    ),
    errors: [
      {
        status: 500,
        description: `Default Response`,
        schema: z.literal('error'),
      },
    ],
  },
  {
    method: 'post',
    path: '/api/v2/channels',
    alias: 'createChannelV2',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: createChannelV2_Body,
      },
    ],
    response: z.object({ id: z.string() }),
    errors: [
      {
        status: 500,
        description: `Default Response`,
        schema: z.object({}).partial(),
      },
    ],
  },
  {
    method: 'get',
    path: '/api/v2/channels/:number',
    alias: 'getChannelsByNumberV2',
    requestFormat: 'json',
    parameters: [
      {
        name: 'number',
        type: 'Path',
        schema: z.number(),
      },
    ],
    response: z.object({
      number: z.number(),
      watermark: z
        .object({
          url: z.string().optional(),
          enabled: z.boolean(),
          position: z.string(),
          width: z.number(),
          verticalMargin: z.number(),
          horizontalMargin: z.number(),
          duration: z.number(),
          fixedSize: z.boolean(),
          animated: z.boolean(),
        })
        .optional(),
      fillerCollections: z
        .array(
          z.object({
            id: z.string(),
            weight: z.number(),
            cooldownSeconds: z.number(),
          }),
        )
        .optional(),
      programs: z.array(
        z.object({
          channel: z.number().optional(),
          customOrder: z.number().optional(),
          customShowId: z.string().optional(),
          customShowName: z.string().optional(),
          date: z.string().optional(),
          duration: z.number(),
          episode: z.number().optional(),
          episodeIcon: z.string().optional(),
          file: z.string().optional(),
          id: z.string(),
          icon: z.string().optional(),
          isOffline: z.boolean(),
          key: z.string().optional(),
          plexFile: z.string().optional(),
          rating: z.string().optional(),
          ratingKey: z.string().optional(),
          season: z.number().optional(),
          seasonIcon: z.string().optional(),
          serverKey: z.string().optional(),
          showIcon: z.string().optional(),
          showTitle: z.string().optional(),
          summary: z.string().optional(),
          title: z.string().optional(),
          type: z.union([
            z.literal('movie'),
            z.literal('episode'),
            z.literal('track'),
            z.literal('redirect'),
            z.literal('custom'),
            z.literal('flex'),
          ]),
          year: z.number().optional(),
        }),
      ),
      icon: z.object({
        path: z.string(),
        width: z.number(),
        duration: z.number(),
        position: z.string(),
      }),
      guideMinimumDurationSeconds: z.number(),
      groupTitle: z.string(),
      disableFillerOverlay: z.boolean(),
      startTime: z.number(),
      offline: z.object({
        picture: z.string().optional(),
        soundtrack: z.string().optional(),
        mode: z.union([z.literal('pic'), z.literal('clip')]),
      }),
      name: z.string(),
      transcoding: z
        .object({
          targetResolution: z.object({
            widthPx: z.number(),
            heightPx: z.number(),
          }),
          videoBitrate: z.number().optional(),
          videoBufferSize: z.number().optional(),
        })
        .optional(),
      duration: z.number(),
      fallback: z
        .array(
          z.object({
            channel: z.number().optional(),
            customOrder: z.number().optional(),
            customShowId: z.string().optional(),
            customShowName: z.string().optional(),
            date: z.string().optional(),
            duration: z.number(),
            episode: z.number().optional(),
            episodeIcon: z.string().optional(),
            file: z.string().optional(),
            id: z.string(),
            icon: z.string().optional(),
            isOffline: z.boolean(),
            key: z.string().optional(),
            plexFile: z.string().optional(),
            rating: z.string().optional(),
            ratingKey: z.string().optional(),
            season: z.number().optional(),
            seasonIcon: z.string().optional(),
            serverKey: z.string().optional(),
            showIcon: z.string().optional(),
            showTitle: z.string().optional(),
            summary: z.string().optional(),
            title: z.string().optional(),
            type: z.union([
              z.literal('movie'),
              z.literal('episode'),
              z.literal('track'),
              z.literal('redirect'),
              z.literal('custom'),
              z.literal('flex'),
            ]),
            year: z.number().optional(),
          }),
        )
        .optional(),
      stealth: z.boolean(),
      guideFlexPlaceholder: z.string().optional(),
      fillerRepeatCooldown: z.number().optional(),
    }),
    errors: [
      {
        status: 404,
        description: `Default Response`,
        schema: z.unknown(),
      },
      {
        status: 500,
        description: `Default Response`,
        schema: z.unknown(),
      },
    ],
  },
  {
    method: 'put',
    path: '/api/v2/channels/:number',
    alias: 'putApiv2channelsNumber',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: createChannelV2_Body,
      },
      {
        name: 'number',
        type: 'Path',
        schema: z.number(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/v2/channels/:number/lineup',
    alias: 'getApiv2channelsNumberlineup',
    requestFormat: 'json',
    parameters: [
      {
        name: 'from',
        type: 'Query',
        schema: z.string().datetime({ offset: true }),
      },
      {
        name: 'to',
        type: 'Query',
        schema: z.string().datetime({ offset: true }),
      },
      {
        name: 'number',
        type: 'Path',
        schema: z.number(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/v2/channels/:number/programs',
    alias: 'getApiv2channelsNumberprograms',
    requestFormat: 'json',
    parameters: [
      {
        name: 'number',
        type: 'Path',
        schema: z.number(),
      },
    ],
    response: z.unknown(),
    errors: [
      {
        status: 404,
        description: `Default Response`,
        schema: z.unknown(),
      },
    ],
  },
  {
    method: 'get',
    path: '/api/v2/custom-shows',
    alias: 'getApiv2customShows',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/v2/jobs',
    alias: 'getApiv2jobs',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/v2/plex/status',
    alias: 'getApiv2plexstatus',
    requestFormat: 'json',
    parameters: [
      {
        name: 'serverName',
        type: 'Query',
        schema: z.string(),
      },
    ],
    response: z.object({ healthy: z.boolean() }),
    errors: [
      {
        status: 404,
        description: `Default Response`,
        schema: z.object({ message: z.string() }),
      },
      {
        status: 500,
        description: `Default Response`,
        schema: z.object({ message: z.string() }),
      },
    ],
  },
  {
    method: 'get',
    path: '/api/v2/programming/:externalId',
    alias: 'getProgramByExternalId',
    requestFormat: 'json',
    parameters: [
      {
        name: 'externalId',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({
      channel: z.number().optional(),
      customOrder: z.number().optional(),
      customShowId: z.string().optional(),
      customShowName: z.string().optional(),
      date: z.string().optional(),
      duration: z.number(),
      episode: z.number().optional(),
      episodeIcon: z.string().optional(),
      file: z.string().optional(),
      id: z.string(),
      icon: z.string().optional(),
      isOffline: z.boolean(),
      key: z.string().optional(),
      plexFile: z.string().optional(),
      rating: z.string().optional(),
      ratingKey: z.string().optional(),
      season: z.number().optional(),
      seasonIcon: z.string().optional(),
      serverKey: z.string().optional(),
      showIcon: z.string().optional(),
      showTitle: z.string().optional(),
      summary: z.string().optional(),
      title: z.string().optional(),
      type: z.union([
        z.literal('movie'),
        z.literal('episode'),
        z.literal('track'),
        z.literal('redirect'),
        z.literal('custom'),
        z.literal('flex'),
      ]),
      year: z.number().optional(),
    }),
    errors: [
      {
        status: 400,
        description: `Default Response`,
        schema: z.object({ message: z.string() }),
      },
      {
        status: 404,
        description: `Default Response`,
        schema: z.unknown(),
      },
    ],
  },
  {
    method: 'post',
    path: '/api/v2/programming/batch/lookup',
    alias: 'batchGetProgramsByExternalIds',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: batchGetProgramsByExternalIds_Body,
      },
    ],
    response: z.array(
      z.object({
        channel: z.number().optional(),
        customOrder: z.number().optional(),
        customShowId: z.string().optional(),
        customShowName: z.string().optional(),
        date: z.string().optional(),
        duration: z.number(),
        episode: z.number().optional(),
        episodeIcon: z.string().optional(),
        file: z.string().optional(),
        id: z.string(),
        icon: z.string().optional(),
        isOffline: z.boolean(),
        key: z.string().optional(),
        plexFile: z.string().optional(),
        rating: z.string().optional(),
        ratingKey: z.string().optional(),
        season: z.number().optional(),
        seasonIcon: z.string().optional(),
        serverKey: z.string().optional(),
        showIcon: z.string().optional(),
        showTitle: z.string().optional(),
        summary: z.string().optional(),
        title: z.string().optional(),
        type: z.union([
          z.literal('movie'),
          z.literal('episode'),
          z.literal('track'),
          z.literal('redirect'),
          z.literal('custom'),
          z.literal('flex'),
        ]),
        year: z.number().optional(),
      }),
    ),
  },
  {
    method: 'get',
    path: '/api/version',
    alias: 'getApiversion',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/xmltv-last-refresh',
    alias: 'getApixmltvLastRefresh',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/xmltv-settings',
    alias: 'getApixmltvSettings',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'put',
    path: '/api/xmltv-settings',
    alias: 'putApixmltvSettings',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'post',
    path: '/api/xmltv-settings',
    alias: 'postApixmltvSettings',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/api/xmltv.xml',
    alias: 'getApixmltv_xml',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'post',
    path: '/api/xmltv/refresh',
    alias: 'postApixmltvrefresh',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/cache/images/:hash',
    alias: 'getCacheimagesHash',
    requestFormat: 'json',
    parameters: [
      {
        name: 'hash',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/device.xml',
    alias: 'getDevice_xml',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/discover.json',
    alias: 'getDiscover_json',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/lineup_status.json',
    alias: 'getLineup_status_json',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/lineup.json',
    alias: 'getLineup_json',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/m3u8',
    alias: 'getM3u8',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/media-player/:number.m3u',
    alias: 'getMediaPlayerNumber_m3u',
    requestFormat: 'json',
    parameters: [
      {
        name: 'number',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/media-player/fast/:number.m3u',
    alias: 'getMediaPlayerfastNumber_m3u',
    requestFormat: 'json',
    parameters: [
      {
        name: 'number',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/media-player/radio/:number.m3u',
    alias: 'getMediaPlayerradioNumber_m3u',
    requestFormat: 'json',
    parameters: [
      {
        name: 'number',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.void(),
  },
  {
    method: 'get',
    path: '/playlist',
    alias: 'getPlaylist',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/radio',
    alias: 'getRadio',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/setup',
    alias: 'getSetup',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/stream',
    alias: 'getStream',
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/video',
    alias: 'getVideo',
    requestFormat: 'json',
    response: z.void(),
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
