/* eslint-disable import/no-relative-packages */
import { WebContentsView } from 'electron';
import {
  AutoRepeatModeChangeRequestedEventArgs,
  MediaPlaybackType,
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

const onButtonPressed = (
  deezerView: WebContentsView,
  sender: SystemMediaTransportControls,
  args: SystemMediaTransportControlsButtonPressedEventArgs
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
      // deezerView.webContents.send(MEDIA_SET_SEEK, dzOffset / dzLength, true);
      break;
    case SystemMediaTransportControlsButton.Rewind:
      // deezerView.webContents.send(MEDIA_SET_SEEK, dzOffset / dzLength, true);
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
      throw Error(`Unexpected Windows media button ${args.button}`);
  }
};

const onAutoRepeatModeChangeRequested = (
  deezerView: WebContentsView,
  sender: SystemMediaTransportControls,
  args: AutoRepeatModeChangeRequestedEventArgs
) =>
  deezerView.webContents.send(MEDIA_SET_REPEAT, args.requestedAutoRepeatMode);

const onShuffleEnabledChangeRequested = (
  deezerView: WebContentsView,
  sender: SystemMediaTransportControls,
  args: ShuffleEnabledChangeRequestedEventArgs
) =>
  deezerView.webContents.send(MEDIA_SET_SHUFFLE, args.requestedShuffleEnabled);

const updateMetadataSong = (smtc: SystemMediaTransportControls, data: Song) => {
  // We rely on OS to the cleanup for us...
  const updater = smtc.displayUpdater;
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
  properties.trackNumber = parseInt(data.TRACK_NUMBER, 10);
  updater.update();
};

const updateMetadataEpisode = (
  smtc: SystemMediaTransportControls,
  data: Episode
) => {
  // We rely on OS to the cleanup for us...
  const updater = smtc.displayUpdater;
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
  data: Song | Episode
) => {
  const timeline = new SystemMediaTransportControlsTimelineProperties();
  timeline.startTime = { duration: 0n };
  timeline.minSeekTime = { duration: 0n };
  timeline.endTime = { duration: BigInt(data.DURATION) };
  timeline.maxSeekTime = { duration: BigInt(data.DURATION) };
  timeline.position = 
  smtc.updateTimelineProperties(timeline);
};

export const initializePlayer = (
  toolbarView: WebContentsView,
  deezerView: WebContentsView
) => {
  const player = new MediaPlayer();
  const smtc = player.systemMediaTransportControls;
  player.commandManager.isEnabled = false;

  smtc.isFastForwardEnabled = true;
  smtc.isNextEnabled = true;
  smtc.isPauseEnabled = true;
  smtc.isPlayEnabled = true;
  smtc.isPreviousEnabled = true;
  smtc.isRewindEnabled = true;
  smtc.isStopEnabled = true;

  smtc.onButtonPressed((sender, args) =>
    onButtonPressed(deezerView, sender, args)
  );

  smtc.onAutoRepeatModeChangeRequested((sender, args) =>
    onAutoRepeatModeChangeRequested(deezerView, sender, args)
  );

  // smtc.onPlaybackPositionChangeRequested;

  smtc.onShuffleEnabledChangeRequested((sender, args) =>
    onShuffleEnabledChangeRequested(deezerView, sender, args)
  );

  player.media;

  // smtc.onButtonPressed()

  // smtc.is;

  // player.
  // const player: Player = new Player({
  //   name: 'DeezerEnhanced',
  //   identity: 'Deezer media player',
  //   supportedUriSchemes: [],
  //   supportedMimeTypes: [],
  //   supportedInterfaces: ['player'],
  //   desktopEntry: 'deezer-enhanced',
  // });

  // player.getPosition = () => {
  //   const songCurrent = new Date();
  //   if (player.playbackStatus === Player.PLAYBACK_STATUS_PAUSED) {
  //     return songOffset;
  //   }
  //   return (songCurrent.getTime() - songStart) * 1_000 + songOffset;
  // };

  // player.isPlaying = () => {
  //   return player.playbackStatus === Player.PLAYBACK_STATUS_PLAYING;
  // };

  // createMprisListeners(player, toolbarView);
  // createMprisHandles(player, deezerView);
};
