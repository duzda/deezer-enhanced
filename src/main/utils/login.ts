import { BrowserName } from '@steipete/sweet-cookie';

// browsers supported by the library used for extraction
export const LIBRARY_SUPPORTED_BROWSERS: Readonly<Record<BrowserName, string>> =
  {
    chrome: 'Google Chrome',
    edge: 'Microsoft Edge',
    firefox: 'Mozilla Firefox',
    safari: 'Safari',
  };

// in the future, support for other browsers can be added
export const SUPPORTED_BROWSERS: Readonly<Record<string, string>> =
  LIBRARY_SUPPORTED_BROWSERS;

export const ARL_COOKIE_NAME = 'arl';
