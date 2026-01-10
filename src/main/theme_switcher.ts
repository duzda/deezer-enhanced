import { ipcMain, WebContentsView } from 'electron';
import { THEMES_SET_STYLE } from '../common/channels/themes';

export const initializeThemeSwitcher = (view: WebContentsView) => {
  ipcMain.on(THEMES_SET_STYLE, (_, style) => {
    view.webContents.send(THEMES_SET_STYLE, style);
  });
};
