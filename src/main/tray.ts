import { BaseWindow, Menu, Tray, WebContentsView, app } from 'electron';
import fs from 'fs';
import path from 'path';
import {
  MPRIS_NEXT_SONG,
  MPRIS_PREV_SONG,
  MPRIS_TOGGLE_STATUS,
} from '../common/channels/mpris';
import {
  TRAY_ADD_VOLUME,
  TRAY_FAVORITE,
  TRAY_MUTE,
} from '../common/channels/tray';
import { saveBounds } from './bounds/save';

const USER_TRAY_ICON = path.join(app.getPath('userData'), 'assets', 'icon.png');
const DEFAULT_TRAY_ICON = path.join(
  app.isPackaged ? process.resourcesPath : '.',
  'assets',
  'icon.png'
);

const VOLUME_STEP = 0.05;

let tray: Tray | undefined;

export const destroyTray = () => {
  if (tray) {
    tray.destroy();
    tray = undefined;
  }
};

export const initializeTray = (window: BaseWindow, view: WebContentsView) => {
  fs.access(USER_TRAY_ICON, (err) => {
    const trayIcon = err ? DEFAULT_TRAY_ICON : USER_TRAY_ICON;
    tray = new Tray(trayIcon);

    const template = Menu.buildFromTemplate([
      {
        label: 'Show/Hide',
        enabled: true,
        click: () => {
          if (!window.isVisible()) {
            window.restore();
          } else {
            window.hide();
          }
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Play/Pause',
        enabled: true,
        click: () => view.webContents.send(MPRIS_TOGGLE_STATUS),
      },
      {
        label: 'Next',
        enabled: true,
        click: () => view.webContents.send(MPRIS_NEXT_SONG),
      },
      {
        label: 'Previous',
        enabled: true,
        click: () => view.webContents.send(MPRIS_PREV_SONG),
      },
      {
        type: 'separator',
      },
      {
        label: 'Favorite/Unfavorite',
        enabled: true,
        click: () => view.webContents.send(TRAY_FAVORITE),
      },
      {
        type: 'separator',
      },
      {
        label: 'Volume Up',
        enabled: true,
        click: () => view.webContents.send(TRAY_ADD_VOLUME, VOLUME_STEP),
      },
      {
        label: 'Volume Down',
        enabled: true,
        click: () => view.webContents.send(TRAY_ADD_VOLUME, -VOLUME_STEP),
      },
      {
        label: 'Mute',
        enabled: true,
        click: () => view.webContents.send(TRAY_MUTE),
      },
      {
        type: 'separator',
      },
      {
        label: 'Quit',
        enabled: true,
        click: () => {
          saveBounds(window);
          process.exit();
        },
      },
    ]);

    tray.setContextMenu(template);

    tray.on('click', () => {
      if (window.isVisible()) {
        window.hide();
      } else {
        window.restore();
      }
    });
  });
};
