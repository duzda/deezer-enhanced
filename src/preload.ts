import { contextBridge, ipcRenderer } from 'electron';
import { HISTORY_GO_BACK, HISTORY_GO_FORWARD } from './common/channels/history';
import {
  SETTINGS_GET,
  SETTINGS_HIDE,
  SETTINGS_RESET,
  SETTINGS_SET_PROPERTY,
  SETTINGS_SHOW,
  SETTINGS_SWITCH,
} from './common/channels/settings';
import { Settings } from './common/types/settings';
import { DOWNLOADS_DOWNLOAD } from './common/channels/downloads';
import { KEYBOARD_SEND_KEYPRESS } from './common/channels/keyboard';
import { SerializedKeyboardEvent } from './common/types/serializedKeyboardEvent';

export const historyAPI = {
  goForward: () => ipcRenderer.send(HISTORY_GO_FORWARD),
  goBack: () => ipcRenderer.send(HISTORY_GO_BACK),
};

export const downloadsAPI = {
  download: () => ipcRenderer.send(DOWNLOADS_DOWNLOAD),
};

export const settingsAPI = {
  getSettings: (): Promise<Settings> => ipcRenderer.invoke(SETTINGS_GET),
  setSettingProperty: (key: string, value: unknown) =>
    ipcRenderer.send(SETTINGS_SET_PROPERTY, key, value),
  resetSettings: () => ipcRenderer.send(SETTINGS_RESET),
  switchSettings: () => ipcRenderer.send(SETTINGS_SWITCH),
  onShowSettings: (callback: () => void) =>
    ipcRenderer.on(SETTINGS_SHOW, () => callback()),
  onHideSettings: (callback: () => void) =>
    ipcRenderer.on(SETTINGS_HIDE, () => callback()),
};

export const keyboardAPI = {
  sendKeypress: (event: SerializedKeyboardEvent) =>
    ipcRenderer.send(KEYBOARD_SEND_KEYPRESS, event),
};

contextBridge.exposeInMainWorld('renderer', {
  historyAPI,
  downloadsAPI,
  settingsAPI,
  keyboardAPI,
});
