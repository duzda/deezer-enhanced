import { contextBridge, ipcRenderer } from 'electron';
import { HISTORY_GO_BACK, HISTORY_GO_FORWARD } from './common/channels/history';
import {
  SETTINGS_GET,
  SETTINGS_HIDE,
  SETTINGS_RESET,
  SETTINGS_SET_PROPERTY,
  SETTINGS_SHOW,
} from './common/channels/settings';
import { Settings } from './common/types/settings';
import {
  DOWNLOADS_DOWNLOAD,
  DOWNLOADS_FINISHED,
} from './common/channels/downloads';
import { KEYBOARD_SEND_KEYPRESS } from './common/channels/keyboard';
import { SerializedKeyboardEvent } from './common/types/serializedKeyboardEvent';
import { ExecStatus } from './common/types/deemix';
import { NOTIFICATIONS_CREATE } from './common/channels/notifications';
import { THEMES_SET_ACCENT, THEMES_SET_THEME } from './common/channels/themes';

export const historyAPI = {
  goForward: () => ipcRenderer.send(HISTORY_GO_FORWARD),
  goBack: () => ipcRenderer.send(HISTORY_GO_BACK),
};

export const downloadsAPI = {
  download: () => ipcRenderer.send(DOWNLOADS_DOWNLOAD),
  onDownloadFinished: (
    callback: (
      status: ExecStatus,
      url: string,
      stdout: string,
      stderr: string
    ) => void
  ) => {
    ipcRenderer.on(
      DOWNLOADS_FINISHED,
      (_, status: ExecStatus, url: string, stdout: string, stderr: string) =>
        callback(status, url, stdout, stderr)
    );
  },
};

export const settingsAPI = {
  getSettings: (): Promise<Settings> => ipcRenderer.invoke(SETTINGS_GET),
  setSettingProperty: (key: string, value: unknown) =>
    ipcRenderer.send(SETTINGS_SET_PROPERTY, key, value),
  resetSettings: () => ipcRenderer.send(SETTINGS_RESET),
  showSettings: () => ipcRenderer.send(SETTINGS_SHOW),
  hideSettings: () => ipcRenderer.send(SETTINGS_HIDE),
};

export const keyboardAPI = {
  sendKeypress: (event: SerializedKeyboardEvent) =>
    ipcRenderer.send(KEYBOARD_SEND_KEYPRESS, event),
};

export const notificationsAPI = {
  onNotificationCreate: (
    callback: (title: string, body: string, icon: string) => void
  ) => {
    ipcRenderer.on(
      NOTIFICATIONS_CREATE,
      (_, title: string, body: string, icon: string) =>
        callback(title, body, icon)
    );
  },
};

export const themesAPI = {
  onThemeChange: (callback: (theme: string) => void) => {
    ipcRenderer.on(THEMES_SET_THEME, (_, theme) => callback(theme));
  },
  onAccentChange: (callback: (accent: string) => void) => {
    ipcRenderer.on(THEMES_SET_ACCENT, (_, accent) => callback(accent));
  },
};

contextBridge.exposeInMainWorld('renderer', {
  historyAPI,
  downloadsAPI,
  settingsAPI,
  keyboardAPI,
  notificationsAPI,
  themesAPI,
});
