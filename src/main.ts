import { app, BaseWindow, session, WebContentsView } from 'electron';
import path from 'path';
import fs from 'fs';
import { createHistoryHandles } from './main/history';
import { getSettings, initializeSettings } from './main/settings';
import { loadBounds } from './main/bounds/load';
import { saveBounds } from './main/bounds/save';
import { initializeDownloads } from './main/downloads';
import { initializePlayer } from './main/mpris';
import { initializeThemeSwitcher } from './main/theme_switcher';
import { createKeyboardHandles } from './main/keyboard';
import { DEEZER_URL } from './main/utils/urls';
import { generateMenu } from './main/menu';
import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  NAVBAR_HEIGHT,
} from './main/utils/size';

const USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

const gotTheLock = app.requestSingleInstanceLock();

const HOST_BLACKLIST: ReadonlyArray<string> = [
  'googletagmanager.com',
  'segment.com',
  'sentry.io',
  'survicate.com',
];

if (!gotTheLock) {
  app.quit();
} else {
  // AudioServiceOutOfProcess is a workaround for github.com/electron/electron/issues/27581 and can be removed once upstream merges a fix
  app.commandLine.appendSwitch('disable-features', 'AudioServiceOutOfProcess,MediaSessionService');

  const createWindow = () => {
    session.defaultSession.setUserAgent(USER_AGENT);

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      // To allow communication with the API we need to fill Access-Control-Allow-Origin, this is probably safe as CSP will block the rest?
      if (
        details.responseHeaders === undefined ||
        (details.responseHeaders['Access-Control-Allow-Origin'] === undefined &&
          details.responseHeaders['access-control-allow-origin'] === undefined)
      ) {
        callback({
          responseHeaders: {
            ...details.responseHeaders,
            'Access-Control-Allow-Origin': ['*'],
          },
        });
      } else {
        callback(details);
      }
    });

    session.defaultSession.webRequest.onBeforeRequest(
      { urls: ['*://*/*'] },
      (details, callback) => {
        const url = new URL(details.url);

        if (HOST_BLACKLIST.some((host) => url.hostname.endsWith(host))) {
          callback({ cancel: true });
          return;
        }

        callback({ cancel: false });
      }
    );

    const mainWindow = new BaseWindow({
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      autoHideMenuBar: true,
      show: false,
      icon: path.join(
        app.isPackaged ? process.resourcesPath : '.',
        'assets',
        'icon.png'
      ),
    });

    mainWindow.removeMenu();

    const mainView = new WebContentsView({
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      mainView.webContents.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
      mainView.webContents.loadFile(
        path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
      );
    }

    mainView.setBounds({
      x: 0,
      y: 0,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    });

    mainView.webContents.on('context-menu', (_, properties) => {
      generateMenu(mainView, properties).popup({
        x: properties.x,
        y: properties.y,
      });
    });

    const view = new WebContentsView({
      webPreferences: {
        preload: path.join(__dirname, 'preload_view.js'),
      },
    });

    view.webContents.setWindowOpenHandler(() => {
      return { action: 'deny' };
    });

    view.setBounds({
      x: 0,
      y: NAVBAR_HEIGHT,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT - NAVBAR_HEIGHT,
    });
    view.webContents.loadURL(DEEZER_URL);

    initializeSettings(mainWindow, view).then(() => loadBounds(mainWindow));
    initializePlayer(view);
    initializeDownloads(mainView, view);
    initializeThemeSwitcher(mainView);
    createHistoryHandles(view);
    createKeyboardHandles(view);

    view.webContents.on('did-finish-load', () => {
      view.webContents.on('context-menu', (_, properties) => {
        generateMenu(view, properties).popup({
          x: properties.x,
          y: properties.y,
        });
      });

      fs.readFile(path.join(__dirname, '../build/view.js'), (err, data) => {
        if (err === null) {
          view.webContents.executeJavaScript(data.toString());
        }
      });
    });

    mainWindow.contentView.addChildView(mainView);
    mainWindow.contentView.addChildView(view);

    mainWindow.on('resize', () => {
      mainView.setBounds({
        x: 0,
        y: 0,
        width: mainWindow.getBounds().width,
        height: mainWindow.getBounds().height,
      });
      view.setBounds({
        x: 0,
        y: NAVBAR_HEIGHT,
        width: mainWindow.getBounds().width,
        height: mainWindow.getBounds().height - NAVBAR_HEIGHT,
      });
    });

    mainWindow.on('close', (e) => {
      if (getSettings().closeToTray && getSettings().enableTray) {
        e.preventDefault();
        mainWindow.hide();
        return false;
      }

      saveBounds(mainWindow);
      return true;
    });
  };

  app.on('ready', createWindow);

  app.on('second-instance', () => {
    if (BaseWindow.getAllWindows().length > 0) {
      const window = BaseWindow.getAllWindows()[0];
      if (window.isMinimized() || !window.isVisible()) {
        window.show();
        return;
      }

      window.focus();
    }
  });

  app.on('browser-window-created', (_, window) => {
    window.setMenuBarVisibility(false);
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}
