import {
  trayAPI,
  mprisAPI,
  settingsAPI,
  themesAPI,
  zoomAPI,
} from '../preload_view';
import { DZPlayer } from './types/dzplayer';
import { Events } from './types/events';

type DeezerUserIDCarrier = {
  deezer_user_id: number;
};

declare global {
  interface Window {
    Events?: Events;
    dzPlayer: DZPlayer;
    dataLayer: Array<DeezerUserIDCarrier>;
    view: {
      settingsAPI: typeof settingsAPI;
      mprisAPI: typeof mprisAPI;
      trayAPI: typeof trayAPI;
      themesAPI: typeof themesAPI;
      zoomAPI: typeof zoomAPI;
    };
  }
}
