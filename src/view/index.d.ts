import {
  trayAPI,
  mediaAPI,
  settingsAPI,
  platformAPI,
  themesAPI,
  zoomAPI,
} from '../preload_view';

declare global {
  interface Window {
    view: {
      settingsAPI: typeof settingsAPI;
      mediaAPI: typeof mediaAPI;
      platformAPI: typeof platformAPI;
      trayAPI: typeof trayAPI;
      themesAPI: typeof themesAPI;
      zoomAPI: typeof zoomAPI;
    };
  }
}
