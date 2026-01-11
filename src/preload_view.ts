import { contextBridge, ipcRenderer } from 'electron';
import {
  MPRIS_NEXT_SONG,
  MPRIS_PAUSE,
  MPRIS_PLAY,
  MPRIS_PREV_SONG,
  MPRIS_READ_POSITION,
  MPRIS_READ_REPEAT,
  MPRIS_READ_SHUFFLE,
  MPRIS_READ_SONG,
  MPRIS_READ_STATUS,
  MPRIS_READ_VOLUME,
  MPRIS_SET_REPEAT,
  MPRIS_SET_SEEK,
  MPRIS_SET_SHUFFLE,
  MPRIS_SET_VOLUME,
  MPRIS_STOP,
  MPRIS_TOGGLE_STATUS,
} from './common/channels/mpris';
import { Repeat, Song, Episode } from './common/types/deezer';
import {
  SETTINGS_GET,
  SETTINGS_SET_PROPERTY,
} from './common/channels/settings';
import { Settings } from './common/types/settings';
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

export const settingsAPI = {
  getSettings: (): Promise<Settings> => ipcRenderer.invoke(SETTINGS_GET),
  onSetProperty: (callback: (key: string, value: unknown) => void) => {
    ipcRenderer.on(SETTINGS_SET_PROPERTY, (_, key: string, value: unknown) =>
      callback(key, value)
    );
  },
};

export const mprisAPI = {
  sendPosition: (position: number) =>
    ipcRenderer.send(MPRIS_READ_POSITION, position),
  sendSong: (metadata: Song | Episode | null) =>
    ipcRenderer.send(MPRIS_READ_SONG, metadata),
  sendStatus: (playing: boolean) =>
    ipcRenderer.send(MPRIS_READ_STATUS, playing),
  sendVolume: (volume: number) => ipcRenderer.send(MPRIS_READ_VOLUME, volume),
  sendShuffle: (shuffle: boolean) =>
    ipcRenderer.send(MPRIS_READ_SHUFFLE, shuffle),
  sendRepeat: (repeat: Repeat) => ipcRenderer.send(MPRIS_READ_REPEAT, repeat),
  onPlay: (callback: () => void) => {
    ipcRenderer.on(MPRIS_PLAY, () => callback());
  },
  onPause: (callback: () => void) => {
    ipcRenderer.on(MPRIS_PAUSE, () => callback());
  },
  onStop: (callback: () => void) => {
    ipcRenderer.on(MPRIS_STOP, () => callback());
  },
  onToggleStatus: (callback: () => void) => {
    ipcRenderer.on(MPRIS_TOGGLE_STATUS, () => callback());
  },
  onNextSong: (callback: () => void) => {
    ipcRenderer.on(MPRIS_NEXT_SONG, () => callback());
  },
  onPrevSong: (callback: () => void) => {
    ipcRenderer.on(MPRIS_PREV_SONG, () => callback());
  },
  onSetVolume: (callback: (volume: number) => void) => {
    ipcRenderer.on(MPRIS_SET_VOLUME, (_, volume) => callback(volume));
  },
  onSetRepeat: (callback: (repeat: Repeat) => void) => {
    ipcRenderer.on(MPRIS_SET_REPEAT, (_, repeat) => callback(repeat));
  },
  onSetShuffle: (callback: (shuffle: boolean) => void) => {
    ipcRenderer.on(MPRIS_SET_SHUFFLE, (_, shuffle) => callback(shuffle));
  },
  onSetSeek: (callback: (position: number, move: boolean) => void) => {
    ipcRenderer.on(MPRIS_SET_SEEK, (_, position, move) =>
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

contextBridge.exposeInMainWorld('view', {
  settingsAPI,
  mprisAPI,
  trayAPI,
  themesAPI,
});
