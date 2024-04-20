import { downloadsAPI, historyAPI, keyboardAPI, settingsAPI } from '../preload';

declare global {
  interface Window {
    renderer: {
      historyAPI: typeof historyAPI;
      downloadsAPI: typeof downloadsAPI;
      settingsAPI: typeof settingsAPI;
      keyboardAPI: typeof keyboardAPI;
    };
  }
}
