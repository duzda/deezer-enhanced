import { ipcMain, WebContentsView } from 'electron';
import { getCookies } from '@steipete/sweet-cookie';
import {
  LOGIN_IS_LOGGED_IN,
  LOGIN_EXTRACT_LOGIN_COOKIE_FROM_BROWSER,
  LOGIN_SET_LOGIN_COOKIE,
} from '../common/channels/login';
import { DEEZER_URL } from './utils/urls';
import { ARL_COOKIE_NAME, LIBRARY_SUPPORTED_BROWSERS } from './utils/login';

export const createLoginHandles = (view: WebContentsView) => {
  ipcMain.handle(LOGIN_IS_LOGGED_IN, async () => {
    const cookies = await view.webContents.session.cookies.get({
      url: DEEZER_URL,
      name: ARL_COOKIE_NAME,
    });

    return cookies.length > 0;
  });

  ipcMain.on(LOGIN_SET_LOGIN_COOKIE, (_, arl: string) => {
    // noinspection JSIgnoredPromiseFromCall
    view.webContents.session.cookies.set({
      url: DEEZER_URL,
      name: ARL_COOKIE_NAME,
      value: arl,
    });
  });

  ipcMain.handle(
    LOGIN_EXTRACT_LOGIN_COOKIE_FROM_BROWSER,
    async (_, browserId: string): Promise<string> => {
      if (browserId in LIBRARY_SUPPORTED_BROWSERS) {
        const { cookies, warnings } = await getCookies({
          url: DEEZER_URL,
          names: [ARL_COOKIE_NAME],
          browsers: [<'chrome' | 'edge' | 'firefox' | 'safari'>browserId],
        });

        if (warnings.length > 0) {
          return `Error: ${warnings.join('; ')}`;
        }

        if (cookies[0] === undefined) {
          return `Error: No cookie found.`;
        }

        return cookies[0].value;
      }

      // TODO: other browsers can be handled there
      switch (browserId) {
        default:
          return '';
      }
    }
  );
};
