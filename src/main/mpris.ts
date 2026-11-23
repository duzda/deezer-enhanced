import Player from '@jellybrick/mpris-service';
import { ipcMain, WebContentsView } from 'electron';
import {
  MPRIS_NEXT_SONG,
  MPRIS_PAUSE,
  MPRIS_PLAY,
  MPRIS_PREV_SONG,
  MPRIS_READ_POSITION,
  MPRIS_READ_REPEAT,
  MPRIS_READ_SHUFFLE,
  MPRIS_READ_SONG,
  MPRIS_READ_STATUS,
  MPRIS_READ_VOLUME,
  MPRIS_SET_REPEAT,
  MPRIS_SET_SEEK,
  MPRIS_SET_SHUFFLE,
  MPRIS_SET_VOLUME,
  MPRIS_STOP,
  MPRIS_TOGGLE_STATUS,
} from '../common/channels/mpris';
import {
  DEEZER_ART_RESOLUTION,
  DEEZER_EPISODE_ART_URL,
  DEEZER_EPISODE_URL,
  DEEZER_NOTIFICATION_RESOLUTION,
  DEEZER_SONG_ART_URL,
  DEEZER_TRACK_URL,
} from './utils/urls';
import { isDiscordEnabled, setDiscordActivity } from './discord';
import { getSettings } from './settings';
import { Episode, Song } from '../common/types/deezer';
import { NOTIFICATIONS_CREATE } from '../common/channels/notifications';

let songId = '';

let songStart = 0;
let songOffset = 0;

const status = ['None', 'Playlist', 'Track'];

const createMprisHandles = (player: Player, deezerView: WebContentsView) => {
  player.on('quit', () => {
    process.exit();
  });
  player.on('pause', () => deezerView.webContents.send(MPRIS_PAUSE));
  player.on('play', () => deezerView.webContents.send(MPRIS_PLAY));
  player.on('playpause', () =>
    deezerView.webContents.send(MPRIS_TOGGLE_STATUS)
  );
  player.on('stop', () => deezerView.webContents.send(MPRIS_STOP));
  player.on('loopStatus', (loopStatus) => {
    if (typeof loopStatus === 'string') {
      const index = status.indexOf(loopStatus);
      player.loopStatus = status[index];
      deezerView.webContents.send(MPRIS_SET_REPEAT, index);
    }
  });
  player.on('shuffle', (shuffleStatus) => {
    if (typeof shuffleStatus === 'boolean') {
      player.shuffle = shuffleStatus;
      deezerView.webContents.send(MPRIS_SET_SHUFFLE, shuffleStatus);
    }
  });
  player.on('next', () => deezerView.webContents.send(MPRIS_NEXT_SONG));
  player.on('previous', () => deezerView.webContents.send(MPRIS_PREV_SONG));
  player.on('volume', (volume) =>
    deezerView.webContents.send(MPRIS_SET_VOLUME, volume)
  );
  // For setting the exact position (for example): playerctl position 10
  player.on('position', (event) => {
    if ('position' in event && typeof event.position === 'number') {
      const dzPosition = event.position / 1_000_000;
      const dzLength = player.metadata['mpris:length'] / 1_000_000;
      deezerView.webContents.send(MPRIS_SET_SEEK, dzPosition / dzLength, false);
    }
  });
  // For setting the position (for example): playerctl position 10+
  player.on('seek', (offset) => {
    if (typeof offset === 'number') {
      const dzOffset = offset / 1_000_000;
      const dzLength = player.metadata['mpris:length'] / 1_000_000;
      deezerView.webContents.send(MPRIS_SET_SEEK, dzOffset / dzLength, true);
    }
  });
};

const updateMetadataSong = (player: Player, data: Song) => {
  player.metadata = {
    'mpris:trackid': player.objectPath(`Track/${data.SNG_ID}`),
    'mpris:length': parseFloat(data.DURATION) * 1_000_000,
    'mpris:artUrl':
      DEEZER_SONG_ART_URL + data.ALB_PICTURE + DEEZER_ART_RESOLUTION,
    'xesam:title': data.SNG_TITLE,
    'xesam:album': data.ALB_TITLE,
    'xesam:artist':
      data.ARTISTS !== undefined
        ? data.ARTISTS.map((artist) => artist.ART_NAME)
        : [data.ART_NAME],
    'xesam:url': DEEZER_TRACK_URL + data.SNG_ID,
  };
};

const updateMetadataEpisode = (player: Player, data: Episode) => {
  player.metadata = {
    'mpris:trackid': player.objectPath(`Track/${data.EPISODE_ID}`),
    'mpris:length': parseFloat(data.DURATION) * 1_000_000,
    'mpris:artUrl':
      DEEZER_EPISODE_ART_URL + data.SHOW_ART_MD5 + DEEZER_ART_RESOLUTION,
    'xesam:title': data.EPISODE_TITLE,
    'xesam:album': data.SHOW_NAME,
    'xesam:artist': [data.SHOW_NAME],
    'xesam:url': DEEZER_EPISODE_URL + data.EPISODE_ID,
  };
};

const isSong = (data: any): data is Song => data.SNG_ID;
const isEpisode = (data: any): data is Episode => data.EPISODE_ID;

const createMprisListeners = (player: Player, deezerView: WebContentsView) => {
  ipcMain.on(MPRIS_READ_SONG, (_, data) => {
    if (!data) return;
    if (isSong(data)) {
      updateMetadataSong(player, data);

      if (isDiscordEnabled()) {
        void setDiscordActivity(
          data.SNG_TITLE,
          data.ARTISTS !== undefined
            ? data.ARTISTS.map((artist) => artist.ART_NAME).join(', ')
            : data.ART_NAME,
          data.ALB_TITLE,
          DEEZER_SONG_ART_URL + data.ALB_PICTURE + DEEZER_ART_RESOLUTION,
          player.isPlaying(),
          player.getPosition() / 1_000,
          Number(data.DURATION) * 1_000,
          DEEZER_TRACK_URL + data.SNG_ID
        );
      }

      if (getSettings().enableNotifications && data.SNG_ID !== songId) {
        deezerView.webContents.send(
          NOTIFICATIONS_CREATE,
          data.SNG_TITLE,
          data.ART_NAME,
          DEEZER_SONG_ART_URL +
            data.ALB_PICTURE +
            DEEZER_NOTIFICATION_RESOLUTION
        );

        songId = data.SNG_ID;
      }
    } else if (isEpisode(data)) {
      updateMetadataEpisode(player, data);

      if (isDiscordEnabled()) {
        void setDiscordActivity(
          data.EPISODE_TITLE,
          data.SHOW_NAME,
          data.SHOW_NAME,
          DEEZER_EPISODE_ART_URL + data.SHOW_ART_MD5 + DEEZER_ART_RESOLUTION,
          player.isPlaying(),
          player.getPosition() / 1_000,
          Number(data.DURATION) * 1_000,
          DEEZER_EPISODE_URL + data.EPISODE_ID
        );
      }

      if (getSettings().enableNotifications && data.EPISODE_ID !== songId) {
        deezerView.webContents.send(
          NOTIFICATIONS_CREATE,
          data.EPISODE_TITLE,
          data.SHOW_NAME,
          DEEZER_EPISODE_ART_URL +
            data.SHOW_ART_MD5 +
            DEEZER_NOTIFICATION_RESOLUTION
        );

        songId = data.EPISODE_ID;
      }
    }
  });
  ipcMain.on(MPRIS_READ_POSITION, (_, position) => {
    songStart = new Date().getTime();
    songOffset = position * 1_000_000;
  });
  ipcMain.on(MPRIS_READ_STATUS, (_, playing) => {
    player.playbackStatus = playing
      ? Player.PLAYBACK_STATUS_PLAYING
      : Player.PLAYBACK_STATUS_PAUSED;
  });
  ipcMain.on(MPRIS_READ_VOLUME, (_, volume) => {
    player.volume = volume;
  });
  ipcMain.on(MPRIS_READ_SHUFFLE, (_, shuffleStatus) => {
    player.shuffle = shuffleStatus;
  });
  ipcMain.on(MPRIS_READ_REPEAT, (_, loopStatus) => {
    player.loopStatus = status[loopStatus];
  });
};

export const initializePlayer = (
  toolbarView: WebContentsView,
  deezerView: WebContentsView
) => {
  const player: Player = new Player({
    name: 'DeezerEnhanced',
    identity: 'Deezer media player',
    supportedUriSchemes: [],
    supportedMimeTypes: [],
    supportedInterfaces: ['player'],
    desktopEntry: 'deezer-enhanced',
  });

  player.getPosition = () => {
    const songCurrent = new Date();
    if (player.playbackStatus === Player.PLAYBACK_STATUS_PAUSED) {
      return songOffset;
    }
    return (songCurrent.getTime() - songStart) * 1_000 + songOffset;
  };

  player.isPlaying = () => {
    return player.playbackStatus === Player.PLAYBACK_STATUS_PLAYING;
  };

  createMprisListeners(player, toolbarView);
  createMprisHandles(player, deezerView);
};
