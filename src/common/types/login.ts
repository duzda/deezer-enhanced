export type LoginType = 'login' | 'registration';

export const LOGIN_MAP: Readonly<Record<LoginType, string>> = {
  login:
    'https://account.deezer.com/en/login/?source=electron&redirect_uri=https://www.deezer.com/desktop/login/electron/callback?source=electron',
  registration:
    'https://account.deezer.com/en/signup/?source=electron&redirect_uri=https://www.deezer.com/desktop/login/electron/callback?source=electron',
};
