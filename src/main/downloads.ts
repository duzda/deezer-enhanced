import { promisify } from 'util';
import { ExecException, exec as execProcess } from 'child_process';
import { BrowserView, BrowserWindow, ipcMain } from 'electron';
import { ExecStatus, warningMessages } from '../common/types/deemix';
import {
  DOWNLOADS_DOWNLOAD,
  DOWNLOADS_FINISHED,
} from '../common/channels/downloads';

const exec = promisify(execProcess);

const containsWarning = (stdout: string) =>
  stdout
    .split('\n')
    .some((l) => warningMessages.some((error) => l.endsWith(error)));

const download = async (url: string, window: BrowserWindow) => {
  try {
    const { stdout, stderr } = await exec(`deemix ${url}`);
    let execStatus: ExecStatus = 'Success';
    if (containsWarning(stdout)) {
      execStatus = 'Warning';
    }

    window.webContents.send(
      DOWNLOADS_FINISHED,
      execStatus,
      url,
      stdout,
      stderr
    );
  } catch (e) {
    const execException = e as ExecException;
    window.webContents.send(
      DOWNLOADS_FINISHED,
      'Error',
      url,
      execException.stdout !== undefined ? execException.stdout : '',
      execException.stderr !== undefined ? execException.stderr : ''
    );
  }
};

const createDownloadHandles = (window: BrowserWindow, view: BrowserView) => {
  ipcMain.on(DOWNLOADS_DOWNLOAD, () => {
    download(view.webContents.getURL(), window);
  });
};

export const initializeDownloads = (
  window: BrowserWindow,
  view: BrowserView
) => {
  createDownloadHandles(window, view);
};
