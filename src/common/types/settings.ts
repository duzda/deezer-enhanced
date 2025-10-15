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

export type SettingsProperties =
  | 'enableTray'
  | 'closeToTray'
  | 'startInTray'
  | 'enableNotifications'
  | 'deemixIntegration'
  | 'volumePower'
  | 'discordRPC';

type Setter<T> = (newValue: T) => void | undefined;

export type Setters = {
  enableTray: Setter<boolean>;
  closeToTray: Setter<boolean>;
  startInTray: Setter<boolean>;
  enableNotifications: Setter<boolean>;
  deemixIntegration: Setter<boolean>;
  volumePower: Setter<number>;
  discordRPC: Setter<boolean>;
};
