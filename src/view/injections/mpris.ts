import { favorite } from './favorite';

export const initializeMpris = () => {
  if (typeof window.Events !== 'undefined') {
    window.Events.subscribe(window.Events.player.playerReady, () => {
      window.view.mprisAPI.sendPosition(window.dzPlayer.getPosition());
      window.view.mprisAPI.sendSong(window.dzPlayer.getCurrentSong());
    });
    window.Events.subscribe(window.Events.player.updateCurrentTrack, () => {
      window.view.mprisAPI.sendPosition(window.dzPlayer.getPosition());
      window.view.mprisAPI.sendSong(window.dzPlayer.getCurrentSong());
    });
    window.Events.subscribe(window.Events.player.trackChange, () => {
      window.view.mprisAPI.sendPosition(window.dzPlayer.getPosition());
      window.view.mprisAPI.sendSong(window.dzPlayer.getCurrentSong());
    });
    window.Events.subscribe(window.Events.player.playing, () => {
      window.view.mprisAPI.sendStatus(window.dzPlayer.isPlaying());
      window.view.mprisAPI.sendPosition(window.dzPlayer.getPosition());
      window.view.mprisAPI.sendSong(window.dzPlayer.getCurrentSong());
    });
    window.Events.subscribe(window.Events.player.volume_changed, () => {
      window.view.mprisAPI.sendVolume(window.dzPlayer.getVolume());
    });
    window.Events.subscribe(window.Events.player.shuffle_changed, () => {
      window.view.mprisAPI.sendShuffle(window.dzPlayer.isShuffle());
    });
    window.Events.subscribe(window.Events.player.repeat_changed, () => {
      window.view.mprisAPI.sendRepeat(window.dzPlayer.getRepeat());
    });
  }

  window.view.mprisAPI.onPlay(() => window.dzPlayer.control.play());
  window.view.mprisAPI.onPause(() => window.dzPlayer.control.pause());
  window.view.mprisAPI.onStop(() => window.dzPlayer.control.pause());
  window.view.mprisAPI.onToggleStatus(() =>
    window.dzPlayer.control.togglePause()
  );
  window.view.mprisAPI.onNextSong(() => window.dzPlayer.control.nextSong());
  window.view.mprisAPI.onPrevSong(() => window.dzPlayer.control.prevSong());
  window.view.mprisAPI.onSetVolume((volume) =>
    window.dzPlayer.control.setVolume(volume)
  );
  window.view.mprisAPI.onSetRepeat((repeat) =>
    window.dzPlayer.control.setRepeat(repeat)
  );
  window.view.mprisAPI.onSetShuffle((shuffle) => {
    window.dzPlayer.control.setShuffle(shuffle);
  });
  window.view.mprisAPI.onSetSeek((position, move) => {
    const currentSong = window.dzPlayer.getCurrentSong();
    if (currentSong) {
      if (move) {
        window.dzPlayer.control.seek(
          window.dzPlayer.getPosition() / parseFloat(currentSong.DURATION) +
            position
        );
      } else {
        window.dzPlayer.control.seek(position);
      }
    }
  });

  window.view.trayAPI.onAddVolume((volume) => {
    window.dzPlayer.control.setVolume(window.dzPlayer.getVolume() + volume);
  });
  window.view.trayAPI.favorite(() => favorite());
  window.view.trayAPI.onMute(() =>
    window.dzPlayer.control.mute(!window.dzPlayer.isMuted())
  );
};
