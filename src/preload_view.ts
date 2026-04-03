import { contextBridge, ipcRenderer } from 'electron';
import {
  MEDIA_NEXT_SONG,
  MEDIA_PAUSE,
  MEDIA_PLAY,
  MEDIA_PREV_SONG,
  MEDIA_READ_POSITION,
  MEDIA_READ_REPEAT,
  MEDIA_READ_SHUFFLE,
  MEDIA_READ_SONG,
  MEDIA_READ_STATUS,
  MEDIA_READ_VOLUME,
  MEDIA_SET_REPEAT,
  MEDIA_SET_SEEK,
  MEDIA_SET_SHUFFLE,
  MEDIA_SET_VOLUME,
  MEDIA_STOP,
  MEDIA_TOGGLE_STATUS,
} from './common/channels/media';
import { Repeat, Song, Episode } from './common/types/deezer';
import {
  SETTINGS_GET,
  SETTINGS_SET_PROPERTY,
} from './common/channels/settings';
import { Settings } from './common/types/settings';
import { ZoomType } from './common/types/zoom';
import {
  TRAY_MUTE,
  TRAY_ADD_VOLUME,
  TRAY_FAVORITE,
} from './common/channels/tray';
import {
  THEMES_INITIALIZE_CUSTOM_STYLE,
  THEMES_INJECT_CUSTOM_STYLE,
  THEMES_SET_STYLE,
} from './common/channels/themes';
import { ZOOM_SET } from './common/channels/zoom';

export const settingsAPI = {
  getSettings: (): Promise<Settings> => ipcRenderer.invoke(SETTINGS_GET),
  onSetProperty: (callback: (key: string, value: unknown) => void) => {
    ipcRenderer.on(SETTINGS_SET_PROPERTY, (_, key: string, value: unknown) =>
      callback(key, value)
    );
  },
};

export const mediaAPI = {
  sendPosition: (position: number) =>
    ipcRenderer.send(MEDIA_READ_POSITION, position),
  sendSong: (metadata: Song | Episode | null) =>
    ipcRenderer.send(MEDIA_READ_SONG, metadata),
  sendStatus: (playing: boolean) =>
    ipcRenderer.send(MEDIA_READ_STATUS, playing),
  sendVolume: (volume: number) => ipcRenderer.send(MEDIA_READ_VOLUME, volume),
  sendShuffle: (shuffle: boolean) =>
    ipcRenderer.send(MEDIA_READ_SHUFFLE, shuffle),
  sendRepeat: (repeat: Repeat) => ipcRenderer.send(MEDIA_READ_REPEAT, repeat),
  onPlay: (callback: () => void) => {
    ipcRenderer.on(MEDIA_PLAY, () => callback());
  },
  onPause: (callback: () => void) => {
    ipcRenderer.on(MEDIA_PAUSE, () => callback());
  },
  onStop: (callback: () => void) => {
    ipcRenderer.on(MEDIA_STOP, () => callback());
  },
  onToggleStatus: (callback: () => void) => {
    ipcRenderer.on(MEDIA_TOGGLE_STATUS, () => callback());
  },
  onNextSong: (callback: () => void) => {
    ipcRenderer.on(MEDIA_NEXT_SONG, () => callback());
  },
  onPrevSong: (callback: () => void) => {
    ipcRenderer.on(MEDIA_PREV_SONG, () => callback());
  },
  onSetVolume: (callback: (volume: number) => void) => {
    ipcRenderer.on(MEDIA_SET_VOLUME, (_, volume) => callback(volume));
  },
  onSetRepeat: (callback: (repeat: Repeat) => void) => {
    ipcRenderer.on(MEDIA_SET_REPEAT, (_, repeat) => callback(repeat));
  },
  onSetShuffle: (callback: (shuffle: boolean) => void) => {
    ipcRenderer.on(MEDIA_SET_SHUFFLE, (_, shuffle) => callback(shuffle));
  },
  onSetSeek: (callback: (position: number, move: boolean) => void) => {
    ipcRenderer.on(MEDIA_SET_SEEK, (_, position, move) =>
      callback(position, move)
    );
  },
};

export const trayAPI = {
  onMute: (callback: () => void) => {
    ipcRenderer.on(TRAY_MUTE, () => callback());
  },
  onAddVolume: (callback: (volume: number) => void) => {
    ipcRenderer.on(TRAY_ADD_VOLUME, (_, volume) => callback(volume));
  },
  favorite: (callback: () => void) => {
    ipcRenderer.on(TRAY_FAVORITE, () => callback());
  },
};

export const themesAPI = {
  setStyle: (styles: string) => ipcRenderer.send(THEMES_SET_STYLE, styles),
  onInjectCss: (callback: (styles: string) => void) => {
    ipcRenderer.on(THEMES_INJECT_CUSTOM_STYLE, (_, styles) => callback(styles));
  },
  initializeCustomCss: () => ipcRenderer.send(THEMES_INITIALIZE_CUSTOM_STYLE),
};

export const zoomAPI = {
  zoom: (zoomType: ZoomType) => ipcRenderer.send(ZOOM_SET, zoomType),
};

contextBridge.exposeInMainWorld('view', {
  settingsAPI,
  mediaAPI,
  trayAPI,
  themesAPI,
  zoomAPI,
});
