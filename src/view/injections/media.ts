import { ViewWindow } from '../types';
import { favorite } from './favorite';

export const initializeMedia = () => {
  const viewWindow: ViewWindow = window as ViewWindow;
  if (typeof viewWindow.Events !== 'undefined') {
    viewWindow.Events.subscribe(viewWindow.Events.player.playerReady, () => {
      viewWindow.view.mediaAPI.sendPosition(viewWindow.dzPlayer.getPosition());
      viewWindow.view.mediaAPI.sendSong(viewWindow.dzPlayer.getCurrentSong());
    });
    viewWindow.Events.subscribe(
      viewWindow.Events.player.updateCurrentTrack,
      () => {
        viewWindow.view.mediaAPI.sendPosition(
          viewWindow.dzPlayer.getPosition()
        );
        viewWindow.view.mediaAPI.sendSong(viewWindow.dzPlayer.getCurrentSong());
      }
    );
    viewWindow.Events.subscribe(viewWindow.Events.player.trackChange, () => {
      viewWindow.view.mediaAPI.sendPosition(viewWindow.dzPlayer.getPosition());
      viewWindow.view.mediaAPI.sendSong(viewWindow.dzPlayer.getCurrentSong());
    });
    viewWindow.Events.subscribe(viewWindow.Events.player.playing, () => {
      viewWindow.view.mediaAPI.sendStatus(viewWindow.dzPlayer.isPlaying());
      viewWindow.view.mediaAPI.sendPosition(viewWindow.dzPlayer.getPosition());
      viewWindow.view.mediaAPI.sendSong(viewWindow.dzPlayer.getCurrentSong());
    });
    viewWindow.Events.subscribe(viewWindow.Events.player.volume_changed, () => {
      viewWindow.view.mediaAPI.sendVolume(viewWindow.dzPlayer.getVolume());
    });
    viewWindow.Events.subscribe(
      viewWindow.Events.player.shuffle_changed,
      () => {
        viewWindow.view.mediaAPI.sendShuffle(viewWindow.dzPlayer.isShuffle());
      }
    );
    viewWindow.Events.subscribe(viewWindow.Events.player.repeat_changed, () => {
      viewWindow.view.mediaAPI.sendRepeat(viewWindow.dzPlayer.getRepeat());
    });
  }

  viewWindow.view.mediaAPI.onPlay(() => viewWindow.dzPlayer.control.play());
  viewWindow.view.mediaAPI.onPause(() => viewWindow.dzPlayer.control.pause());
  viewWindow.view.mediaAPI.onStop(() => viewWindow.dzPlayer.control.pause());
  viewWindow.view.mediaAPI.onToggleStatus(() =>
    viewWindow.dzPlayer.control.togglePause()
  );
  viewWindow.view.mediaAPI.onNextSong(() =>
    viewWindow.dzPlayer.control.nextSong()
  );
  viewWindow.view.mediaAPI.onPrevSong(() =>
    viewWindow.dzPlayer.control.prevSong()
  );
  viewWindow.view.mediaAPI.onSetVolume((volume) =>
    viewWindow.dzPlayer.control.setVolume(volume)
  );
  viewWindow.view.mediaAPI.onSetRepeat((repeat) =>
    viewWindow.dzPlayer.control.setRepeat(repeat)
  );
  viewWindow.view.mediaAPI.onSetShuffle((shuffle) => {
    viewWindow.dzPlayer.control.setShuffle(shuffle);
  });
  viewWindow.view.mediaAPI.onSetSeek((position, move) => {
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
