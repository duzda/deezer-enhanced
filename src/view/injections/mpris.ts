import { ViewWindow } from '../types';
import { favorite } from './favorite';

export const initializeMpris = () => {
  const viewWindow: ViewWindow = window as ViewWindow;
  if (typeof viewWindow.Events !== 'undefined') {
    viewWindow.Events.subscribe(viewWindow.Events.player.playerReady, () => {
      viewWindow.view.mprisAPI.sendPosition(viewWindow.dzPlayer.getPosition());
      viewWindow.view.mprisAPI.sendSong(viewWindow.dzPlayer.getCurrentSong());
    });
    viewWindow.Events.subscribe(
      viewWindow.Events.player.updateCurrentTrack,
      () => {
        viewWindow.view.mprisAPI.sendPosition(
          viewWindow.dzPlayer.getPosition()
        );
        viewWindow.view.mprisAPI.sendSong(viewWindow.dzPlayer.getCurrentSong());
      }
    );
    viewWindow.Events.subscribe(viewWindow.Events.player.trackChange, () => {
      viewWindow.view.mprisAPI.sendPosition(viewWindow.dzPlayer.getPosition());
      viewWindow.view.mprisAPI.sendSong(viewWindow.dzPlayer.getCurrentSong());
    });
    viewWindow.Events.subscribe(viewWindow.Events.player.playing, () => {
      viewWindow.view.mprisAPI.sendStatus(viewWindow.dzPlayer.isPlaying());
      viewWindow.view.mprisAPI.sendPosition(viewWindow.dzPlayer.getPosition());
      viewWindow.view.mprisAPI.sendSong(viewWindow.dzPlayer.getCurrentSong());
    });
    viewWindow.Events.subscribe(viewWindow.Events.player.volume_changed, () => {
      viewWindow.view.mprisAPI.sendVolume(viewWindow.dzPlayer.getVolume());
    });
    viewWindow.Events.subscribe(
      viewWindow.Events.player.shuffle_changed,
      () => {
        viewWindow.view.mprisAPI.sendShuffle(viewWindow.dzPlayer.isShuffle());
      }
    );
    viewWindow.Events.subscribe(viewWindow.Events.player.repeat_changed, () => {
      viewWindow.view.mprisAPI.sendRepeat(viewWindow.dzPlayer.getRepeat());
    });
  }

  viewWindow.view.mprisAPI.onPlay(() => viewWindow.dzPlayer.control.play());
  viewWindow.view.mprisAPI.onPause(() => viewWindow.dzPlayer.control.pause());
  viewWindow.view.mprisAPI.onStop(() => viewWindow.dzPlayer.control.pause());
  viewWindow.view.mprisAPI.onToggleStatus(() =>
    viewWindow.dzPlayer.control.togglePause()
  );
  viewWindow.view.mprisAPI.onNextSong(() =>
    viewWindow.dzPlayer.control.nextSong()
  );
  viewWindow.view.mprisAPI.onPrevSong(() =>
    viewWindow.dzPlayer.control.prevSong()
  );
  viewWindow.view.mprisAPI.onSetVolume((volume) =>
    viewWindow.dzPlayer.control.setVolume(volume)
  );
  viewWindow.view.mprisAPI.onSetRepeat((repeat) =>
    viewWindow.dzPlayer.control.setRepeat(repeat)
  );
  viewWindow.view.mprisAPI.onSetShuffle((shuffle) => {
    viewWindow.dzPlayer.control.setShuffle(shuffle);
  });
  viewWindow.view.mprisAPI.onSetSeek((position, move) => {
    const currentSong = viewWindow.dzPlayer.getCurrentSong();
    if (currentSong) {
      if (move) {
        viewWindow.dzPlayer.control.seek(
          viewWindow.dzPlayer.getPosition() / parseFloat(currentSong.DURATION) +
            position
        );
      } else {
        viewWindow.dzPlayer.control.seek(position);
      }
    }
  });

  viewWindow.view.trayAPI.onAddVolume((volume) => {
    viewWindow.dzPlayer.control.setVolume(
      viewWindow.dzPlayer.getVolume() + volume
    );
  });
  viewWindow.view.trayAPI.favorite(() => favorite());
  viewWindow.view.trayAPI.onMute(() =>
    viewWindow.dzPlayer.control.mute(!viewWindow.dzPlayer.isMuted())
  );
};
