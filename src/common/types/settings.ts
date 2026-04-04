export interface Settings {
  enableTray: boolean;
  closeToTray: boolean;
  startInTray: boolean;
  enableNotifications: boolean;
  deemixIntegration: boolean;
  volumePower: number;
  discordRPC: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  enableTray: false,
  closeToTray: false,
  startInTray: false,
  enableNotifications: false,
  deemixIntegration: false,
  volumePower: 4,
  discordRPC: false,
};

type Setter<T extends keyof Settings> = (newValue: Settings[T]) => void;

export type Setters = {
  [K in keyof Settings]: Setter<K>;
};
