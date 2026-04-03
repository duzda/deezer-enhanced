import {
  trayAPI,
  mediaAPI,
  settingsAPI,
  themesAPI,
  zoomAPI,
} from '../preload_view';

declare global {
  interface Window {
    view: {
      settingsAPI: typeof settingsAPI;
      mediaAPI: typeof mediaAPI;
      trayAPI: typeof trayAPI;
      themesAPI: typeof themesAPI;
      zoomAPI: typeof zoomAPI;
    };
  }
}
