import { ViewWindow } from '../types';

let volumePower = 0.0;

export const setVolumePower = (volume: number) => {
  volumePower = volume;
  const viewWindow = window as ViewWindow;
  viewWindow.dzPlayer.control.setVolume(viewWindow.dzPlayer.getVolume());
};

export const initializeVolumePower = () => {
  const viewWindow = window as ViewWindow;

  let sliderVolume = 0.0;

  const startupVolume = parseFloat(
    window.localStorage.getItem(
      `volume_${viewWindow.dataLayer[0].deezer_user_id}`
    ) ?? '0.5'
  );

  viewWindow.dzPlayer.getVolume = () => {
    return sliderVolume;
  };

  // Disassembled from Deezer API
  viewWindow.dzPlayer.control.setVolume = (volume) => {
    if (viewWindow.dzPlayer.chromecast.isLoading()) {
      return !1;
    }

    // What is st??
    // This probably only disables setting volume while an ad is playing
    // if (st(dzPlayer.getPlayerType()))
    //    return !1;

    if (viewWindow.dzPlayer.isMuted() && volume > 0) {
      viewWindow.dzPlayer.control.mute(!1);
    }

    viewWindow.dzPlayer.volume = volume;
    sliderVolume = volume;

    if (volumePower > 0) {
      viewWindow.dzPlayer.trigger('audioPlayer_setVolume', [
        volume ** volumePower,
      ]);
    } else {
      viewWindow.dzPlayer.trigger('audioPlayer_setVolume', [volume]);
    }

    if (typeof viewWindow.Events !== 'undefined') {
      viewWindow.Events.trigger(
        viewWindow.Events.player.volume_changed,
        Math.round(100 * volume)
      );
    }

    window.localStorage.setItem(
      `volume_${viewWindow.dataLayer[0].deezer_user_id}`,
      volume.toString()
    );

    return undefined;
  };

  viewWindow.dzPlayer.control.setVolume(startupVolume);
};
