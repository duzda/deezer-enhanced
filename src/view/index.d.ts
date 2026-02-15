import {
  trayAPI,
  mprisAPI,
  settingsAPI,
  themesAPI,
  zoomAPI,
} from '../preload_view';

declare global {
  interface Window {
    view: {
      settingsAPI: typeof settingsAPI;
      mprisAPI: typeof mprisAPI;
      trayAPI: typeof trayAPI;
      themesAPI: typeof themesAPI;
      zoomAPI: typeof zoomAPI;
    };
  }
}
