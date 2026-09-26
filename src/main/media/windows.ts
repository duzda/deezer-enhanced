/* eslint-disable import/no-relative-packages */
import { ipcMain, WebContentsView } from 'electron';
import {
  AutoRepeatModeChangeRequestedEventArgs,
  MediaPlaybackType,
  MediaPlaybackAutoRepeatMode,
  MediaPlaybackStatus,
  MediaPlayer,
  RandomAccessStreamReference,
  ShuffleEnabledChangeRequestedEventArgs,
  SystemMediaTransportControls,
  SystemMediaTransportControlsButton,
  SystemMediaTransportControlsButtonPressedEventArgs,
  SystemMediaTransportControlsTimelineProperties,
  Uri,
} from '../../../generated';
import {
  MEDIA_NEXT_SONG,
  MEDIA_PAUSE,
  MEDIA_PLAY,
  MEDIA_PREV_SONG,
  MEDIA_READ_POSITION,
  MEDIA_READ_SONG,
  MEDIA_READ_STATUS,
  MEDIA_READ_REPEAT,
  MEDIA_READ_SHUFFLE,
  MEDIA_SET_SEEK,
  MEDIA_SET_REPEAT,
  MEDIA_SET_SHUFFLE,
  MEDIA_STOP,
} from '../../common/channels/media';
import { Episode, Song } from '../../common/types/deezer';
import {
  DEEZER_SONG_ART_URL,
  DEEZER_ART_RESOLUTION,
  DEEZER_EPISODE_ART_URL,
} from '../../common/types/urls';
import { showArtist } from './common';
import { createMediaListeners } from './other';

// Deezer: off, all, one. WinRT: none, track, list.
const repeatModes = [
  MediaPlaybackAutoRepeatMode.None,
  MediaPlaybackAutoRepeatMode.List,
  MediaPlaybackAutoRepeatMode.Track,
];
const ticksPerSecond = 10_000_000;

const onButtonPressed = (
  deezerView: WebContentsView,
  sender: SystemMediaTransportControls,
  args: SystemMediaTransportControlsButtonPressedEventArgs,
  seek: (seconds: number) => void
) => {
  switch (args.button) {
    case SystemMediaTransportControlsButton.Play:
      deezerView.webContents.send(MEDIA_PLAY);
      break;
    case SystemMediaTransportControlsButton.Pause:
      deezerView.webContents.send(MEDIA_PAUSE);
      break;
    case SystemMediaTransportControlsButton.Stop:
      deezerView.webContents.send(MEDIA_STOP);
      break;
    case SystemMediaTransportControlsButton.FastForward:
      seek(10);
      break;
    case SystemMediaTransportControlsButton.Rewind:
      seek(-10);
      break;
    case SystemMediaTransportControlsButton.Next:
      deezerView.webContents.send(MEDIA_NEXT_SONG);
      break;
    case SystemMediaTransportControlsButton.Previous:
      deezerView.webContents.send(MEDIA_PREV_SONG);
      break;
    case SystemMediaTransportControlsButton.Record:
    case SystemMediaTransportControlsButton.ChannelUp:
    case SystemMediaTransportControlsButton.ChannelDown:
      break;
    default:
      break;
  }
};

const onAutoRepeatModeChangeRequested = (
  deezerView: WebContentsView,
  sender: SystemMediaTransportControls,
  args: AutoRepeatModeChangeRequestedEventArgs
) => {
  const repeat = repeatModes.indexOf(args.requestedAutoRepeatMode);
  if (repeat !== -1) deezerView.webContents.send(MEDIA_SET_REPEAT, repeat);
};

const onShuffleEnabledChangeRequested = (
  deezerView: WebContentsView,
  sender: SystemMediaTransportControls,
  args: ShuffleEnabledChangeRequestedEventArgs
) =>
  deezerView.webContents.send(MEDIA_SET_SHUFFLE, args.requestedShuffleEnabled);

const updateMetadataSong = (smtc: SystemMediaTransportControls, data: Song) => {
  // We rely on OS to the cleanup for us...
  const updater = smtc.displayUpdater;
  updater.clearAll();
  updater.type = MediaPlaybackType.Music;
  updater.appMediaId = data.SNG_ID;
  updater.thumbnail = RandomAccessStreamReference.createFromUri(
    new Uri(DEEZER_SONG_ART_URL + data.ALB_PICTURE + DEEZER_ART_RESOLUTION)
  );

  const properties = updater.musicProperties;
  properties.title = data.SNG_TITLE;
  properties.albumTitle = data.ALB_TITLE;
  properties.artist = showArtist(data).join(', ');
  [properties.albumArtist] = showArtist(data);
  properties.trackNumber = Math.max(0, parseInt(data.TRACK_NUMBER, 10) || 0);
  updater.update();
};

const updateMetadataEpisode = (
  smtc: SystemMediaTransportControls,
  data: Episode
) => {
  // We rely on OS to the cleanup for us...
  const updater = smtc.displayUpdater;
  updater.clearAll();
  updater.type = MediaPlaybackType.Music;
  updater.appMediaId = data.EPISODE_ID;
  updater.thumbnail = RandomAccessStreamReference.createFromUri(
    new Uri(DEEZER_EPISODE_ART_URL + data.SHOW_ART_MD5 + DEEZER_ART_RESOLUTION)
  );

  const properties = updater.musicProperties;
  properties.title = data.EPISODE_TITLE;
  properties.albumTitle = data.SHOW_NAME;
  properties.artist = data.SHOW_NAME;
  updater.update();
};

const updateTimeline = (
  smtc: SystemMediaTransportControls,
  duration: number,
  position: number
) => {
  const timeline = new SystemMediaTransportControlsTimelineProperties();
  timeline.startTime = { duration: 0n };
  timeline.minSeekTime = { duration: 0n };
  timeline.endTime = {
    duration: BigInt(Math.round(duration * ticksPerSecond)),
  };
  timeline.maxSeekTime = timeline.endTime;
  timeline.position = {
    duration: BigInt(
      Math.round(Math.min(duration, Math.max(0, position)) * ticksPerSecond)
    ),
  };
  smtc.updateTimelineProperties(timeline);
};

export const initializePlayer = (
  toolbarView: WebContentsView,
  deezerView: WebContentsView
) => {
  const player = new MediaPlayer();
  const smtc = player.systemMediaTransportControls;
  player.commandManager.isEnabled = false;
  smtc.isEnabled = true;
  smtc.playbackStatus = MediaPlaybackStatus.Stopped;
  smtc.autoRepeatMode = MediaPlaybackAutoRepeatMode.None;
  smtc.shuffleEnabled = false;

  let duration = 0;
  let position = 0;
  let updatedAt = Date.now();
  let playing = false;
  const getPosition = () =>
    Math.min(
      duration,
      position + (playing ? (Date.now() - updatedAt) / 1000 : 0)
    );
  const seek = (seconds: number, relative = true) => {
    if (duration <= 0 || !Number.isFinite(seconds)) return;
    const target = Math.min(
      duration,
      Math.max(0, seconds + (relative ? getPosition() : 0))
    );
    deezerView.webContents.send(MEDIA_SET_SEEK, target / duration, false);
  };

  smtc.isFastForwardEnabled = true;
  smtc.isNextEnabled = true;
  smtc.isPauseEnabled = true;
  smtc.isPlayEnabled = true;
  smtc.isPreviousEnabled = true;
  smtc.isRewindEnabled = true;
  smtc.isStopEnabled = true;

  const unsubscribe = [
    smtc.onButtonPressed((sender, args) =>
      onButtonPressed(deezerView, sender, args, seek)
    ),
    smtc.onAutoRepeatModeChangeRequested((sender, args) =>
      onAutoRepeatModeChangeRequested(deezerView, sender, args)
    ),
    smtc.onShuffleEnabledChangeRequested((sender, args) =>
      onShuffleEnabledChangeRequested(deezerView, sender, args)
    ),
    smtc.onPlaybackPositionChangeRequested((_, args) =>
      seek(
        Number(args.requestedPlaybackPosition.duration) / ticksPerSecond,
        false
      )
    ),
  ];

  const onSong = (_: Electron.IpcMainEvent, data: Song | Episode | null) => {
    if (!data) {
      duration = 0;
      position = 0;
      playing = false;
      smtc.playbackStatus = MediaPlaybackStatus.Stopped;
      smtc.displayUpdater.clearAll();
      smtc.displayUpdater.update();
    } else {
      const seconds = Number(data.DURATION);
      duration = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
      if ('SNG_ID' in data) updateMetadataSong(smtc, data);
      else updateMetadataEpisode(smtc, data);
    }
    updateTimeline(smtc, duration, getPosition());
  };
  const onPosition = (_: Electron.IpcMainEvent, seconds: number) => {
    if (!Number.isFinite(seconds)) return;
    position = Math.max(0, seconds);
    updatedAt = Date.now();
    updateTimeline(smtc, duration, getPosition());
  };
  const onStatus = (_: Electron.IpcMainEvent, value: boolean) => {
    position = getPosition();
    updatedAt = Date.now();
    playing = value;
    smtc.playbackStatus = playing
      ? MediaPlaybackStatus.Playing
      : MediaPlaybackStatus.Paused;
    updateTimeline(smtc, duration, getPosition());
  };
  const onRepeat = (_: Electron.IpcMainEvent, value: number) => {
    if (repeatModes[value] !== undefined)
      smtc.autoRepeatMode = repeatModes[value];
  };
  const onShuffle = (_: Electron.IpcMainEvent, value: boolean) => {
    smtc.shuffleEnabled = value;
  };
  ipcMain.on(MEDIA_READ_SONG, onSong);
  ipcMain.on(MEDIA_READ_POSITION, onPosition);
  ipcMain.on(MEDIA_READ_STATUS, onStatus);
  ipcMain.on(MEDIA_READ_REPEAT, onRepeat);
  ipcMain.on(MEDIA_READ_SHUFFLE, onShuffle);
  createMediaListeners(toolbarView);

  deezerView.webContents.once('destroyed', () => {
    ipcMain.removeListener(MEDIA_READ_SONG, onSong);
    ipcMain.removeListener(MEDIA_READ_POSITION, onPosition);
    ipcMain.removeListener(MEDIA_READ_STATUS, onStatus);
    ipcMain.removeListener(MEDIA_READ_REPEAT, onRepeat);
    ipcMain.removeListener(MEDIA_READ_SHUFFLE, onShuffle);
    unsubscribe.forEach((remove) => remove());
    smtc.isEnabled = false;
    player.close();
  });
};
