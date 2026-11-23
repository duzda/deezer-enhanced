let volumePower = 0.0;

export const setVolumePower = (volume: number) => {
  volumePower = volume;
  window.dzPlayer.control.setVolume(window.dzPlayer.getVolume());
};

export const initializeVolumePower = () => {
  let sliderVolume = 0.0;

  const startupVolume = parseFloat(
    window.localStorage.getItem(
      `volume_${window.dataLayer[0].deezer_user_id}`
    ) ?? '0.5'
  );

  window.dzPlayer.getVolume = () => {
    return sliderVolume;
  };

  // Disassembled from Deezer API
  window.dzPlayer.control.setVolume = (volume) => {
    if (window.dzPlayer.chromecast.isLoading()) {
      return !1;
    }

    // What is st??
    // This probably only disables setting volume while an ad is playing
    // if (st(dzPlayer.getPlayerType()))
    //    return !1;

    if (window.dzPlayer.isMuted() && volume > 0) {
      window.dzPlayer.control.mute(!1);
    }

    window.dzPlayer.volume = volume;
    sliderVolume = volume;

    if (volumePower > 0) {
      window.dzPlayer.trigger('audioPlayer_setVolume', [volume ** volumePower]);
    } else {
      window.dzPlayer.trigger('audioPlayer_setVolume', [volume]);
    }

    if (typeof window.Events !== 'undefined') {
      window.Events.trigger(
        window.Events.player.volume_changed,
        Math.round(100 * volume)
      );
    }

    window.localStorage.setItem(
      `volume_${window.dataLayer[0].deezer_user_id}`,
      volume.toString()
    );

    return undefined;
  };

  window.dzPlayer.control.setVolume(startupVolume);
};
