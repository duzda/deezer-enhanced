import { globalShortcut, WebContentsView } from 'electron';
import {
  MEDIA_NEXT_SONG,
  MEDIA_PREV_SONG,
  MEDIA_SET_VOLUME,
  MEDIA_STOP,
  MEDIA_TOGGLE_STATUS,
} from '../../common/channels/media';

export const initializeGlobalShortcuts = (view: WebContentsView) => {
  globalShortcut.register('VolumeUp', () =>
    view.webContents.send(MEDIA_SET_VOLUME, 0)
  );
  globalShortcut.register('VolumeDown', () => {});
  globalShortcut.register('VolumeMute', () => {});
  globalShortcut.register('MediaPlayPause', () =>
    view.webContents.send(MEDIA_TOGGLE_STATUS)
  );
  globalShortcut.register('MediaNextTrack', () =>
    view.webContents.send(MEDIA_NEXT_SONG)
  );
  globalShortcut.register('MediaPreviousTrack', () =>
    view.webContents.send(MEDIA_PREV_SONG)
  );
  globalShortcut.register('MediaStop', () => view.webContents.send(MEDIA_STOP));
};
