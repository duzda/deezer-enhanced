import { exec } from 'child_process';
import { BrowserView, app, ipcMain } from 'electron';
import path from 'path';
import { DOWNLOADS_DOWNLOAD } from '../common/channels/downloads';

const DEEMIX_ARL_FILE = path.join(app.getPath('appData'), 'deemix', '.arl');
const DEEMIX_CONFIG_FILE = path.join(
  app.getPath('appData'),
  'deemix',
  'config.json'
);

const download = (url: string) => {
  console.log(`DOWNLOADING ${url}`);
  const downloadScript = exec(`deemix ${url}`);

  // downloadScript.on('close').
  // downloadScript.stdout?.on('')
};

const createDownloadHandles = (view: BrowserView) => {
  ipcMain.on(DOWNLOADS_DOWNLOAD, () => {
    download(view.webContents.getURL());
  });
};

export const initializeDownloads = (view: BrowserView) => {
  createDownloadHandles(view);
};
