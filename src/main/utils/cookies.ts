// browsers supported by the library used for extraction
export const librarySupportedBrowsers: Map<string, string> = new Map<
  string,
  string
>([
  ['chrome', 'Google Chrome'],
  ['edge', 'Microsoft Edge'],
  ['firefox', 'Mozilla Firefox'],
  ['safari', 'Safari'],
]);

// in the future, support for other browsers can be added
export const browsers: Map<string, string> = new Map<string, string>(
  librarySupportedBrowsers
);

export const ARL_COOKIE_NAME = 'arl';
