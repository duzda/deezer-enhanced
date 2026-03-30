import { Cookie, ipcMain, shell, WebContentsView, dialog } from 'electron';
import {
  LOGIN_IS_LOGGED_IN,
  LOGIN_SET_LOGIN_COOKIE,
  LOGIN_OPEN_PAGE,
} from '../common/channels/login';
import {
  ARL_COOKIE_NAME,
  ARL_DOMAIN,
  DEEZER_LOGIN_PROTOCOL,
  DEEZER_PROTOCOL_URI_LOGIN,
} from './utils/login';
import { LOGIN_MAP, LoginType } from '../common/types/login';
import { DEEZER_URL } from './utils/urls';

const setArl = async (view: WebContentsView, arl: string) => {
  await view.webContents.session.cookies.set({
    url: DEEZER_URL,
    name: ARL_COOKIE_NAME,
    value: arl,
    domain: ARL_DOMAIN,
  });
};

export const isLoggedIn = async (view: WebContentsView) => {
  const cookies = await view.webContents.session.cookies.get({
    domain: ARL_DOMAIN,
    name: ARL_COOKIE_NAME,
  });

  return cookies.length > 0;
};

export const handleLoginProtocol = async (
  view: WebContentsView,
  argv: string[]
) => {
  const arg = argv.find((value) => value.startsWith(DEEZER_LOGIN_PROTOCOL));
  if (!arg) return;

  // in future, if any request for some another protocol to be handled would appear,
  // it would be better to bring it protocol handling in some other place,
  // as this functions specifically named to handle login
  if (!arg.startsWith(DEEZER_PROTOCOL_URI_LOGIN)) {
    dialog.showErrorBox(
      'Unexpected URI',
      `Deezer Enhanced has handled the Deezer protocol, but the URI is not supported.\n\nProtocol: ${arg}\n\nOpen a GitHub issue to request support for it: https://github.com/duzda/deezer-enhanced/issues`
    );
    return;
  }

  const arl = arg.replace(DEEZER_PROTOCOL_URI_LOGIN, '');
  setArl(view, arl);
};

export const isValidArlCookie = (cookie: Cookie) => {
  return (
    cookie.domain === ARL_DOMAIN &&
    cookie.name === ARL_COOKIE_NAME &&
    cookie.session
  );
};

export const createLoginHandles = (view: WebContentsView) => {
  ipcMain.handle(LOGIN_IS_LOGGED_IN, async () => {
    const cookies = await view.webContents.session.cookies.get({
      domain: ARL_DOMAIN,
      name: ARL_COOKIE_NAME,
    });

    return cookies.length > 0;
  });

  ipcMain.on(LOGIN_SET_LOGIN_COOKIE, (_, arl: string) => {
    setArl(view, arl);
  });

  ipcMain.on(LOGIN_OPEN_PAGE, (_, loginType: LoginType) => {
    shell.openExternal(LOGIN_MAP[loginType]);
  });
};
