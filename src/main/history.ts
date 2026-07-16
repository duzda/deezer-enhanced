import { ipcMain, WebContentsView } from 'electron';
import {
  HISTORY_GO_BACK,
  HISTORY_GO_FORWARD,
} from '../common/channels/history';

export const createHistoryHandles = (deezerView: WebContentsView) => {
  ipcMain.on(HISTORY_GO_FORWARD, () =>
    deezerView.webContents.navigationHistory.goForward()
  );
  ipcMain.on(HISTORY_GO_BACK, () =>
    deezerView.webContents.navigationHistory.goBack()
  );
};
