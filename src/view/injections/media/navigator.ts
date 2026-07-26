import {
  DEEZER_ART_SUFFIX,
  DEEZER_SONG_ART_URL,
} from '../../../common/types/urls';
import { ViewWindow } from '../../types';
import { DZPlayer } from '../../types/dzplayer';

const SIZES: readonly number[] = [96, 128, 192, 256, 384, 512];

const generateArtworks = (prefix: string): MediaImage[] =>
  SIZES.map((size) => {
    return {
      src: `${prefix}/${size}${DEEZER_ART_SUFFIX}`,
      sizes: `${size}x${size}`,
      type: 'image/jpeg',
    };
  });

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
    navigator.mediaSession.metadata = new MediaMetadata({
      album: data.ALB_TITLE,
      artist:
        data.ARTISTS !== undefined
          ? data.ARTISTS.map((artist) => artist.ART_NAME).join(', ')
          : data.ART_NAME,
      title: data.SNG_TITLE,
      artwork: generateArtworks(DEEZER_SONG_ART_URL + data.ALB_PICTURE),
    });
  } else if ('EPISODE_ID' in data) {
    navigator.mediaSession.metadata = new MediaMetadata({
      album: data.SHOW_NAME,
      artist: data.SHOW_NAME,
      title: data.EPISODE_TITLE,
      artwork: generateArtworks(DEEZER_SONG_ART_URL + data.SHOW_ART_MD5),
    });
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
      setPosition(viewWindow.dzPlayer);
      setMetadata(viewWindow.dzPlayer);
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
