import { ipcMain, session } from 'electron';
import { getCookies } from '@steipete/sweet-cookie';
import {
  COOKIES_GET_ARL_STATUS,
  COOKIES_GET_FROM_BROWSER,
  COOKIES_REMOVE_ARL,
  COOKIES_SET_ARL,
} from '../common/channels/cookies';
import { DEEZER_URL } from './utils/urls';
import { ARL_COOKIE_NAME, librarySupportedBrowsers } from './utils/cookies';

const createCookiesHandle = () => {
  ipcMain.handle(COOKIES_GET_ARL_STATUS, async () => {
    const cookies = await session.defaultSession.cookies.get({
      url: DEEZER_URL,
      name: ARL_COOKIE_NAME,
    });

    return cookies.length > 0;
  });

  ipcMain.handle(COOKIES_REMOVE_ARL, () => {
    session.defaultSession.cookies.remove(DEEZER_URL, ARL_COOKIE_NAME);
  });

  ipcMain.on(COOKIES_SET_ARL, (_, arl: string) => {
    session.defaultSession.cookies.set({
      url: DEEZER_URL,
      name: ARL_COOKIE_NAME,
      value: arl,
    });
  });

  ipcMain.handle(
    COOKIES_GET_FROM_BROWSER,
    async (_, browserId: string): Promise<string> => {
      if (librarySupportedBrowsers.has(browserId)) {
        const { cookies, warnings } = await getCookies({
          url: DEEZER_URL,
          names: [ARL_COOKIE_NAME],
          // @ts-expect-error this array requires a BrowserName, but BrowserName is a union of strings.
          // If librarySupportedBrowsers contain this key, this means that this variable is already one of the strings present in union.
          browsers: [browserId],
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
export const initializeCookies = () => {
  createCookiesHandle();
};
