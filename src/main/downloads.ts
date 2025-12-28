import { promisify } from 'util';
import { ExecException, exec as execProcess } from 'child_process';
import { ipcMain, WebContentsView } from 'electron';
import { ExecStatus, WARNING_MESSAGES } from '../common/types/deemix';
import {
  DOWNLOADS_DOWNLOAD,
  DOWNLOADS_FINISHED,
} from '../common/channels/downloads';

const exec = promisify(execProcess);

const containsWarning = (stdout: string) =>
  stdout
    .split('\n')
    .some((l) => WARNING_MESSAGES.some((error) => l.endsWith(error)));

const download = async (url: string, mainView: WebContentsView) => {
  try {
    const { stdout, stderr } = await exec(`deemix ${url}`);
    let execStatus: ExecStatus = 'Success';
    if (containsWarning(stdout)) {
      execStatus = 'Warning';
    }

    mainView.webContents.send(
      DOWNLOADS_FINISHED,
      execStatus,
      url,
      stdout,
      stderr
    );
  } catch (e) {
    const execException = e as ExecException;
    mainView.webContents.send(
      DOWNLOADS_FINISHED,
      'Error',
      url,
      execException.stdout !== undefined ? execException.stdout : '',
      execException.stderr !== undefined ? execException.stderr : ''
    );
  }
};

const createDownloadHandles = (
  mainView: WebContentsView,
  view: WebContentsView
) => {
  ipcMain.on(DOWNLOADS_DOWNLOAD, () => {
    download(view.webContents.getURL(), mainView);
  });
};

export const initializeDownloads = (
  mainView: WebContentsView,
  view: WebContentsView
) => {
  createDownloadHandles(mainView, view);
};
