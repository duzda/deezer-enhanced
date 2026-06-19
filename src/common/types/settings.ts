export interface Settings {
  enableTray: boolean;
  closeToTray: boolean;
  startInTray: boolean;
  enableNotifications: boolean;
  deemixIntegration: boolean;
  volumePower: number;
  discordRPC: boolean;
  adblock: boolean;
  lastfmUsername: string;
  lastfmApiKey: string;
  lastfmApiSecret: string;
  lastfmMinimumListenedRequiredPercent: number;
  lastfmPassword: string;
}

export const DEFAULT_SETTINGS: Settings = {
  enableTray: false,
  closeToTray: false,
  startInTray: false,
  enableNotifications: false,
  deemixIntegration: false,
  volumePower: 4,
  discordRPC: false,
  adblock: false,
  lastfmUsername: 'Your username',
  lastfmPassword: 'Your password',
  lastfmApiKey: 'Your api key',
  lastfmApiSecret: 'Your api secret',
  lastfmMinimumListenedRequiredPercent: 30,
};

type Setter<T extends keyof Settings> = (newValue: Settings[T]) => void;

export type Setters = {
  [K in keyof Settings]: Setter<K>;
};
