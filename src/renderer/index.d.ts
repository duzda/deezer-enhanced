import {
  downloadsAPI,
  historyAPI,
  keyboardAPI,
  notificationsAPI,
  settingsAPI,
} from '../preload';

declare global {
  interface Window {
    renderer: {
      historyAPI: typeof historyAPI;
      downloadsAPI: typeof downloadsAPI;
      settingsAPI: typeof settingsAPI;
      keyboardAPI: typeof keyboardAPI;
      notificationsAPI: typeof notificationsAPI;
    };
  }
}
