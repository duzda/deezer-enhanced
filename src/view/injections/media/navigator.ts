import {
  ART_RESOLUTION,
  DEEZER_ART_RESOLUTION,
  DEEZER_SONG_ART_URL,
} from '../../../common/types/urls';
import { ViewWindow } from '../../types';
import { DZPlayer } from '../../types/dzplayer';

const setPosition = (dzPlayer: DZPlayer) => {
  navigator.mediaSession.setPositionState({
    duration: Number(dzPlayer.getDuration()),
    position: dzPlayer.getPosition(),
  });
};

const setMetadata = (dzPlayer: DZPlayer) => {
  const data = dzPlayer.getCurrentSong();
  if (!data) return;
  if ('SNG_ID' in data) {
    navigator.mediaSession.metadata = {
      album: data.ALB_TITLE,
      artist:
        data.ARTISTS !== undefined
          ? data.ARTISTS.map((artist) => artist.ART_NAME).join(', ')
          : data.ART_NAME,
      title: data.SNG_TITLE,
      artwork: [
        {
          src: DEEZER_SONG_ART_URL + data.ALB_PICTURE + DEEZER_ART_RESOLUTION,
          sizes: ART_RESOLUTION,
          type: 'image/png',
        },
      ],
    };
  } else if ('EPISODE_ID' in data) {
    navigator.mediaSession.metadata = {
      album: data.SHOW_NAME,
      artist: data.SHOW_NAME,
      title: data.EPISODE_TITLE,
      artwork: [
        {
          src: DEEZER_SONG_ART_URL + data.SHOW_ART_MD5 + DEEZER_ART_RESOLUTION,
          sizes: ART_RESOLUTION,
          type: 'image/png',
        },
      ],
    };
  }
};

export const initializeNavigator = () => {
  const viewWindow: ViewWindow = window as ViewWindow;
  if (typeof viewWindow.Events !== 'undefined') {
    viewWindow.Events.subscribe(viewWindow.Events.player.playerReady, () => {
      navigator.mediaSession.playbackState = 'none';
      navigator.mediaSession.metadata = null;
    });
    viewWindow.Events.subscribe(
      viewWindow.Events.player.updateCurrentTrack,
      () => setPosition(viewWindow.dzPlayer)
    );
    viewWindow.Events.subscribe(viewWindow.Events.player.trackChange, () => {
      setPosition(viewWindow.dzPlayer);
      setMetadata(viewWindow.dzPlayer);
    });
    viewWindow.Events.subscribe(viewWindow.Events.player.playing, () => {
      navigator.mediaSession.playbackState = viewWindow.dzPlayer.isPlaying()
        ? 'playing'
        : 'paused';
    });
  }

  navigator.mediaSession.setActionHandler('play', () => {
    viewWindow.dzPlayer.control.play();
  });
  navigator.mediaSession.setActionHandler('pause', () => {
    viewWindow.dzPlayer.control.pause();
  });
  navigator.mediaSession.setActionHandler('stop', () => {
    viewWindow.dzPlayer.control.stop();
  });
  navigator.mediaSession.setActionHandler('seekbackward', (details) => {
    viewWindow.dzPlayer.control.seek(
      viewWindow.dzPlayer.getPosition() - (details.seekOffset || 10)
    );
  });
  navigator.mediaSession.setActionHandler('seekforward', (details) => {
    viewWindow.dzPlayer.control.seek(
      viewWindow.dzPlayer.getPosition() + (details.seekOffset || 10)
    );
  });
  navigator.mediaSession.setActionHandler('seekto', (details) => {
    viewWindow.dzPlayer.control.seek(details.seekTime!);
  });
  navigator.mediaSession.setActionHandler('previoustrack', () => {
    viewWindow.dzPlayer.control.prevSong();
  });
  navigator.mediaSession.setActionHandler('nexttrack', () => {
    viewWindow.dzPlayer.control.nextSong();
  });
};
