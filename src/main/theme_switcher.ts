import { ipcMain, WebContentsView } from 'electron';
import { THEMES_SET_ACCENT, THEMES_SET_THEME } from '../common/channels/themes';

export const initializeThemeSwitcher = (view: WebContentsView) => {
  ipcMain.on(THEMES_SET_THEME, (_, theme) => {
    view.webContents.send(THEMES_SET_THEME, theme);
  });
  ipcMain.on(THEMES_SET_ACCENT, (_, accent) => {
    view.webContents.send(THEMES_SET_ACCENT, accent);
  });
};
