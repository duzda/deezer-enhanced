import { globalShortcut, ipcMain, WebContentsView } from 'electron';
import {
  MEDIA_NEXT_SONG,
  MEDIA_PREV_SONG,
  MEDIA_READ_POSITION,
  MEDIA_READ_SONG,
  MEDIA_READ_STATUS,
  MEDIA_READ_VOLUME,
  MEDIA_SET_VOLUME,
  MEDIA_STOP,
  MEDIA_TOGGLE_STATUS,
} from '../../common/channels/media';
import { NOTIFICATIONS_CREATE } from '../../common/channels/notifications';
import { Song, Episode } from '../../common/types/deezer';
import { isDiscordEnabled, setDiscordActivity } from '../discord';
import { getSettings } from '../settings';
import {
  DEEZER_SONG_ART_URL,
  DEEZER_ART_RESOLUTION,
  DEEZER_TRACK_URL,
  DEEZER_NOTIFICATION_RESOLUTION,
  DEEZER_EPISODE_ART_URL,
  DEEZER_EPISODE_URL,
} from '../../common/types/urls';

let songId = '';

let songStart = 0;
let songOffset = 0;

// There is no need to ask the actual player, we will use dummy variables instead
const player = {
  playing: false,
  beforeMuteVolume: 0,
  volume: 0,
};

const getPosition = () => {
  const songCurrent = new Date();
  if (!player.playing) {
    return songOffset;
  }
  return (songCurrent.getTime() - songStart) * 1_000 + songOffset;
};

const initializeGlobalShortcuts = (deezerView: WebContentsView) => {
  globalShortcut.register('VolumeUp', () =>
    deezerView.webContents.send(MEDIA_SET_VOLUME, player.volume + 10)
  );
  globalShortcut.register('VolumeDown', () =>
    deezerView.webContents.send(MEDIA_SET_VOLUME, player.volume - 10)
  );
  globalShortcut.register('VolumeMute', () => {
    deezerView.webContents.send(MEDIA_SET_VOLUME, player.beforeMuteVolume);
    player.beforeMuteVolume = player.volume;
  });
  globalShortcut.register('MediaPlayPause', () =>
    deezerView.webContents.send(MEDIA_TOGGLE_STATUS)
  );
  globalShortcut.register('MediaNextTrack', () =>
    deezerView.webContents.send(MEDIA_NEXT_SONG)
  );
  globalShortcut.register('MediaPreviousTrack', () =>
    deezerView.webContents.send(MEDIA_PREV_SONG)
  );
  globalShortcut.register('MediaStop', () =>
    deezerView.webContents.send(MEDIA_STOP)
  );
};

const createMediaListeners = (toolbarView: WebContentsView) => {
  ipcMain.on(MEDIA_READ_SONG, (_, data: Song | Episode | null) => {
    if (!data) return;
    if ('SNG_ID' in data) {
      if (isDiscordEnabled()) {
        setDiscordActivity(
          data.SNG_TITLE,
          data.ARTISTS !== undefined
            ? data.ARTISTS.map((artist) => artist.ART_NAME).join(', ')
            : data.ART_NAME,
          data.ALB_TITLE,
          DEEZER_SONG_ART_URL + data.ALB_PICTURE + DEEZER_ART_RESOLUTION,
          player.playing,
          getPosition() / 1_000,
          Number(data.DURATION) * 1_000,
          DEEZER_TRACK_URL + data.SNG_ID
        );
      }

      if (getSettings().enableNotifications && data.SNG_ID !== songId) {
        toolbarView.webContents.send(
          NOTIFICATIONS_CREATE,
          data.SNG_TITLE,
          data.ART_NAME,
          DEEZER_SONG_ART_URL +
            data.ALB_PICTURE +
            DEEZER_NOTIFICATION_RESOLUTION
        );

        songId = data.SNG_ID;
      }
    } else if ('EPISODE_ID' in data) {
      if (isDiscordEnabled()) {
        setDiscordActivity(
          data.EPISODE_TITLE,
          data.SHOW_NAME,
          data.SHOW_NAME,
          DEEZER_EPISODE_ART_URL + data.SHOW_ART_MD5 + DEEZER_ART_RESOLUTION,
          player.playing,
          getPosition() / 1_000,
          Number(data.DURATION) * 1_000,
          DEEZER_EPISODE_URL + data.EPISODE_ID
        );
      }

      if (getSettings().enableNotifications && data.EPISODE_ID !== songId) {
        toolbarView.webContents.send(
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
  ipcMain.on(MEDIA_READ_POSITION, (_, position) => {
    songStart = new Date().getTime();
    songOffset = position * 1_000_000;
  });
  ipcMain.on(MEDIA_READ_STATUS, (_, playing) => {
    player.playing = playing;
  });
  ipcMain.on(MEDIA_READ_VOLUME, (_, volume) => {
    player.volume = volume;
  });
};

export const initializePlayer = (
  toolbarView: WebContentsView,
  deezerView: WebContentsView
) => {
  initializeGlobalShortcuts(deezerView);
  createMediaListeners(toolbarView);
};
