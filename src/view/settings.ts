import { Setters } from '../common/types/settings';
import { setVolumePower } from './injections/volume';

const OnSet: Setters = {
  enableTray: () => {},
  closeToTray: () => {},
  enableNotifications: () => {},
  deemixIntegration: () => {},
  volumePower: (newValue: number) => setVolumePower(newValue),
  discordRPC: () => {},
};

export const initializeSettings = async () => {
  const settings = await window.view.settingsAPI.getSettings();

  OnSet.enableTray(settings.enableTray);
  OnSet.closeToTray(settings.closeToTray);
  OnSet.enableNotifications(settings.enableNotifications);
  OnSet.deemixIntegration(settings.deemixIntegration);
  OnSet.volumePower(settings.volumePower);
  OnSet.discordRPC(settings.discordRPC);

  window.view.settingsAPI.onSetProperty((key: string, value: unknown) => {
    if (key in OnSet) {
      OnSet[key as keyof Setters](value as never);
    }
  });
};
