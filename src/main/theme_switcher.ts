import { app, ipcMain, WebContentsView } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import {
  THEMES_SET_STYLE,
  THEMES_INJECT_CUSTOM_STYLE,
  THEMES_INITIALIZE_CUSTOM_STYLE,
} from '../common/channels/themes';

const STYLES_FILE = path.join(app.getPath('userData'), 'style.css');

export const initializeThemeSwitcher = (
  mainView: WebContentsView,
  view: WebContentsView
) => {
  ipcMain.on(THEMES_SET_STYLE, (_, style) => {
    mainView.webContents.send(THEMES_SET_STYLE, style);
  });

  const sendStyles = async () => {
    const contents = (await fs.readFile(STYLES_FILE)).toString();
    view.webContents.send(THEMES_INJECT_CUSTOM_STYLE, contents);
    mainView.webContents.send(THEMES_SET_STYLE, contents);
  };

  ipcMain.once(THEMES_INITIALIZE_CUSTOM_STYLE, async () => {
    try {
      await sendStyles();

      const changes = fs.watch(STYLES_FILE);
      // eslint-disable-next-line no-restricted-syntax
      for await (const fileEvent of changes) {
        if (fileEvent.eventType === 'change') {
          await sendStyles();
        } else {
          throw new Error(
            `File ${fileEvent.filename} has been renamed, aborting watching.`
          );
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Error initializing custom styles');
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  });
};
