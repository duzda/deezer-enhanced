import { trayAPI, mprisAPI, settingsAPI } from '../preload_view';

declare global {
  interface Window {
    view: {
      settingsAPI: typeof settingsAPI;
      mprisAPI: typeof mprisAPI;
      trayAPI: typeof trayAPI;
    };
  }
}
