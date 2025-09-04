/* eslint-disable no-param-reassign */
import Player from '@jellybrick/mpris-service';
import { Episode, Song } from 'src/common/types/deezer';
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
  DEEZER_NOTIFICATION_RESOLUTION,
  DEEZER_SONG_ART_URL,
} from './utils/urls';
import { isDiscordEnabled, setDiscordActivity } from './discord';
import { getSettings } from './settings';
import { NOTIFICATIONS_CREATE } from '../common/channels/notifications';

let songId = '';

let songStart = 0;
let songOffset = 0;

const status = ['None', 'Playlist', 'Track'];

const createMprisHandles = (player: Player, view: WebContentsView) => {
  player.on('quit', () => {
    process.exit();
  });
  player.on('pause', () => view.webContents.send(MPRIS_PAUSE));
  player.on('play', () => view.webContents.send(MPRIS_PLAY));
  player.on('playpause', () => view.webContents.send(MPRIS_TOGGLE_STATUS));
  player.on('stop', () => view.webContents.send(MPRIS_STOP));
  player.on('loopStatus', (loopStatus) => {
    if (typeof loopStatus === 'string') {
      const index = status.indexOf(loopStatus);
      player.loopStatus = status[index];
      view.webContents.send(MPRIS_SET_REPEAT, index);
    }
  });
  player.on('shuffle', (shuffleStatus) => {
    if (typeof shuffleStatus === 'boolean') {
      player.shuffle = shuffleStatus;
      view.webContents.send(MPRIS_SET_SHUFFLE, shuffleStatus);
    }
  });
  player.on('next', () => view.webContents.send(MPRIS_NEXT_SONG));
  player.on('previous', () => view.webContents.send(MPRIS_PREV_SONG));
  player.on('volume', (volume) =>
    view.webContents.send(MPRIS_SET_VOLUME, volume)
  );
  // For setting the exact position (for example): playerctl position 10
  player.on('position', (event) => {
    if ('position' in event && typeof event.position === 'number') {
      const dzPosition = event.position / 1_000_000;
      const dzLength = player.metadata['mpris:length'] / 1_000_000;
      view.webContents.send(MPRIS_SET_SEEK, dzPosition / dzLength, false);
    }
  });
  // For setting the position (for example): playerctl position 10+
  player.on('seek', (offset) => {
    if (typeof offset === 'number') {
      const dzOffset = offset / 1_000_000;
      const dzLength = player.metadata['mpris:length'] / 1_000_000;
      view.webContents.send(MPRIS_SET_SEEK, dzOffset / dzLength, true);
    }
  });
};

const updateMetadataSong = (player: Player, data: Song) => {
  player.metadata = {
    'mpris:trackid': player.objectPath('track/0'),
    'mpris:length': parseFloat(data.DURATION) * 1_000_000,
    'mpris:artUrl':
      DEEZER_SONG_ART_URL + data.ALB_PICTURE + DEEZER_ART_RESOLUTION,
    'xesam:title': data.SNG_TITLE,
    'xesam:album': data.ALB_TITLE,
    'xesam:artist':
      data.ARTISTS !== undefined
        ? data.ARTISTS.map((artist) => artist.ART_NAME)
        : [data.ART_NAME],
  };
};

const updateMetadataEpisode = (player: Player, data: Episode) => {
  player.metadata = {
    'mpris:trackid': player.objectPath('track/0'),
    'mpris:length': parseFloat(data.DURATION) * 1_000_000,
    'mpris:artUrl':
      DEEZER_EPISODE_ART_URL + data.SHOW_ART_MD5 + DEEZER_ART_RESOLUTION,
    'xesam:title': data.EPISODE_TITLE,
    'xesam:album': data.SHOW_NAME,
    'xesam:artist': [data.SHOW_NAME],
  };
};

const createMprisListeners = (player: Player, view: WebContentsView) => {
  ipcMain.on(MPRIS_READ_SONG, (_, data) => {
    if (!data) return;
    if (data.SNG_ID) {
      const songData = data as Song;
      updateMetadataSong(player, songData);

      if (isDiscordEnabled()) {
        setDiscordActivity(
          songData.SNG_TITLE,
          songData.ARTISTS !== undefined
            ? songData.ARTISTS.map((artist) => artist.ART_NAME).join(', ')
            : songData.ART_NAME,
          songData.ALB_TITLE,
          DEEZER_SONG_ART_URL + songData.ALB_PICTURE + DEEZER_ART_RESOLUTION,
          player.isPlaying(),
          player.getPosition() / 1_000,
          Number(songData.DURATION) * 1_000
        );
      }

      if (getSettings().enableNotifications && songData.SNG_ID !== songId) {
        view.webContents.send(
          NOTIFICATIONS_CREATE,
          songData.SNG_TITLE,
          songData.ART_NAME,
          DEEZER_SONG_ART_URL +
            songData.ALB_PICTURE +
            DEEZER_NOTIFICATION_RESOLUTION
        );

        songId = songData.SNG_ID;
      }
    } else if (data.EPISODE_ID) {
      const episodeData = data as Episode;
      updateMetadataEpisode(player, episodeData);

      if (isDiscordEnabled()) {
        setDiscordActivity(
          episodeData.EPISODE_TITLE,
          episodeData.SHOW_NAME,
          episodeData.SHOW_NAME,
          DEEZER_EPISODE_ART_URL +
            episodeData.SHOW_ART_MD5 +
            DEEZER_ART_RESOLUTION,
          player.isPlaying(),
          player.getPosition() / 1_000,
          Number(episodeData.DURATION) * 1_000
        );
      }

      if (
        getSettings().enableNotifications &&
        episodeData.EPISODE_ID !== songId
      ) {
        view.webContents.send(
          NOTIFICATIONS_CREATE,
          episodeData.EPISODE_TITLE,
          episodeData.SHOW_NAME,
          DEEZER_EPISODE_ART_URL +
            episodeData.SHOW_ART_MD5 +
            DEEZER_NOTIFICATION_RESOLUTION
        );

        songId = episodeData.EPISODE_ID;
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

export const initializePlayer = (view: WebContentsView) => {
  const player: Player = new Player({
    name: 'Deezer',
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

  createMprisListeners(player, view);
  createMprisHandles(player, view);
};
