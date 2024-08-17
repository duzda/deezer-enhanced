import { BrowserView, BrowserWindow, app, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import {
  SETTINGS_GET,
  SETTINGS_HIDE,
  SETTINGS_RESET,
  SETTINGS_SET_PROPERTY,
  SETTINGS_SHOW,
  SETTINGS_SWITCH,
} from '../common/channels/settings';
import { DEFAULT_SETTINGS, Settings, Setters } from '../common/types/settings';
import { connectDiscord, disconnectDiscord } from './discord';
import { destroyTray, initializeTray } from './tray';

const SETTINGS_FILE = path.join(app.getPath('userData'), 'preferences.json');

let OnSet: Setters;

let currentSettings: Settings = DEFAULT_SETTINGS;

const loadFromFile = async (file: string) => {
  await fs.readFile(file, { encoding: 'utf-8' }, (err, data) => {
    if (!err) {
      currentSettings = JSON.parse(data);

      Object.entries(DEFAULT_SETTINGS).forEach(([key, value]) => {
        if (currentSettings[key as keyof Settings] === undefined) {
          currentSettings[key as keyof Settings] = value as never;
        }
      });

      OnSet.enableTray(currentSettings.enableTray);
      OnSet.closeToTray(currentSettings.closeToTray);
      OnSet.enableNotifications(currentSettings.enableNotifications);
      OnSet.deemixIntegration(currentSettings.deemixIntegration);
      OnSet.volumePower(currentSettings.volumePower);
      OnSet.discordRPC(currentSettings.discordRPC);
    }
  });
};

const saveToFile = async (file: string) => {
  fs.writeFile(
    file,
    JSON.stringify(currentSettings, null, 4),
    {
      encoding: 'utf-8',
    },
    () => {}
  );
};

const createSettingsHandles = (window: BrowserWindow, view: BrowserView) => {
  ipcMain.handle(SETTINGS_GET, () => {
    return currentSettings;
  });

  ipcMain.on(SETTINGS_SET_PROPERTY, (_, key: string, value) => {
    if (key in currentSettings) {
      currentSettings[key as keyof Settings] = value as never;
      saveToFile(SETTINGS_FILE);
    }
    if (key in OnSet) {
      OnSet[key as keyof Setters](value as never);
    }

    view.webContents.send(SETTINGS_SET_PROPERTY, key, value);
  });

  ipcMain.on(SETTINGS_RESET, () => {
    currentSettings = DEFAULT_SETTINGS;
  });

  ipcMain.on(SETTINGS_SWITCH, () => {
    if (window.getBrowserView() === null) {
      window.addBrowserView(view);
      window.webContents.send(SETTINGS_HIDE);
    } else {
      window.removeBrowserView(view);
      window.webContents.send(SETTINGS_SHOW);
    }
  });
};

export const initializeSettings = async (
  window: BrowserWindow,
  view: BrowserView
) => {
  OnSet = {
    enableTray: (enabled) => {
      if (enabled) {
        initializeTray(window, view);
      } else {
        destroyTray();
      }
    },
    closeToTray: () => {},
    enableNotifications: () => {},
    deemixIntegration: () => {},
    volumePower: () => {},
    discordRPC: (enabled) => {
      if (enabled) {
        connectDiscord();
      } else {
        disconnectDiscord();
      }
    },
  };

  await loadFromFile(SETTINGS_FILE);
  createSettingsHandles(window, view);
};

export const getSettings = () => currentSettings;
