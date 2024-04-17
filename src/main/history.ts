import { BrowserView, ipcMain } from 'electron';
import {
  HISTORY_GO_BACK,
  HISTORY_GO_FORWARD,
} from '../common/channels/history';

export const createHistoryHandles = (view: BrowserView) => {
  ipcMain.on(HISTORY_GO_FORWARD, () => view.webContents.goForward());
  ipcMain.on(HISTORY_GO_BACK, () => view.webContents.goBack());
};
