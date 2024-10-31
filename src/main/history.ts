import { ipcMain, WebContentsView } from 'electron';
import {
  HISTORY_GO_BACK,
  HISTORY_GO_FORWARD,
} from '../common/channels/history';

export const createHistoryHandles = (view: WebContentsView) => {
  ipcMain.on(HISTORY_GO_FORWARD, () =>
    view.webContents.navigationHistory.goForward()
  );
  ipcMain.on(HISTORY_GO_BACK, () =>
    view.webContents.navigationHistory.goBack()
  );
};
