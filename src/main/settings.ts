import { BaseWindow, WebContentsView, app, ipcMain } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import {
  SETTINGS_GET,
  SETTINGS_HIDE,
  SETTINGS_RESET,
  SETTINGS_SET_PROPERTY,
  SETTINGS_SHOW,
} from '../common/channels/settings';
import { DEFAULT_SETTINGS, Settings, Setters } from '../common/types/settings';
import { connectDiscord, disconnectDiscord } from './discord';
import { destroyTray, initializeTray } from './tray';

const SETTINGS_FILE = path.join(app.getPath('userData'), 'preferences.json');

let OnSet: Setters;

let currentSettings: Settings = DEFAULT_SETTINGS;

const loadFromFile = async (file: string) => {
  try {
    const data = await fs.readFile(file, { encoding: 'utf-8' });

    currentSettings = JSON.parse(data);

    Object.entries(DEFAULT_SETTINGS).forEach(([key, value]) => {
      if (currentSettings[key as keyof Settings] === undefined) {
        currentSettings[key as keyof Settings] = value as never;
      }
    });

    OnSet.enableTray(currentSettings.enableTray);
    OnSet.closeToTray(currentSettings.closeToTray);
    OnSet.startInTray(currentSettings.startInTray);
    OnSet.enableNotifications(currentSettings.enableNotifications);
    OnSet.deemixIntegration(currentSettings.deemixIntegration);
    OnSet.volumePower(currentSettings.volumePower);
    OnSet.discordRPC(currentSettings.discordRPC);
  } catch {
    // eslint-disable-next-line no-console
    console.warn(`Error trying to read settings from file: ${file}`);
  }
};

const saveToFile = async (file: string) => {
  await fs.writeFile(file, JSON.stringify(currentSettings, null, 4), {
    encoding: 'utf-8',
  });
};

const createSettingsHandles = (window: BaseWindow, view: WebContentsView) => {
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

  ipcMain.on(SETTINGS_SHOW, () => {
    window.contentView.removeChildView(view);
  });

  ipcMain.on(SETTINGS_HIDE, () => {
    window.contentView.addChildView(view);
  });
};

export const initializeSettings = async (
  window: BaseWindow,
  view: WebContentsView
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
    startInTray: () => {},
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
