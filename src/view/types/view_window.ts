import { DZPlayer } from './dzplayer';
import { Events } from './events';

type DeezerUserIDCarrier = {
  deezer_user_id: number;
};

export type ViewWindow = Window &
  typeof globalThis & {
    Events?: Events;
    dzPlayer: DZPlayer;
    dataLayer: Array<DeezerUserIDCarrier>;
  };
