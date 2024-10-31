import {
  app,
  BaseWindow,
  BrowserWindow,
  session,
  WebContentsView,
} from 'electron';
import path from 'path';
import fs from 'fs';
import { createHistoryHandles } from './main/history';
import { getSettings, initializeSettings } from './main/settings';
import { loadBounds, saveBounds } from './main/bounds';
import { initializeDownloads } from './main/downloads';
import { initializePlayer } from './main/mpris';
import { createKeyboardHandles } from './main/keyboard';
import { DEEZER_URL } from './main/utils/urls';
import { generateMenu } from './main/menu';

const USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.commandLine.appendSwitch('disable-features', 'MediaSessionService');

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

    const mainWindow = new BaseWindow({
      width: 800,
      height: 600,
      autoHideMenuBar: true,
      show: false,
      icon: path.join(
        app.isPackaged ? process.resourcesPath : '.',
        'assets',
        'icon.png'
      ),
    });

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

    mainView.setBounds({ x: 0, y: 0, width: 800, height: 600 });

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

    view.setBounds({ x: 0, y: 48, width: 800, height: 552 });
    view.webContents.loadURL(DEEZER_URL);

    loadBounds(mainWindow);
    initializeSettings(mainWindow, view);
    initializePlayer(view);
    initializeDownloads(view);
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
        y: 48,
        width: mainWindow.getBounds().width,
        height: mainWindow.getBounds().height - 48,
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
    if (BrowserWindow.getAllWindows().length > 0) {
      const window = BrowserWindow.getAllWindows()[0];
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

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}
