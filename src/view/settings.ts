import { Setters } from '../common/types/settings';
import { setVolumePower } from './injections/volume';

const OnSet: Setters = {
  closeToTray: () => {},
  deemixIntegration: () => {},
  discordRPC: () => {},
  enableTray: () => {},
  volumePower: (newValue: number) => setVolumePower(newValue),
};

export const initializeSettings = async () => {
  const settings = await window.view.settingsAPI.getSettings();

  OnSet.closeToTray(settings.closeToTray);
  OnSet.deemixIntegration(settings.deemixIntegration);
  OnSet.discordRPC(settings.discordRPC);
  OnSet.enableTray(settings.enableTray);
  OnSet.volumePower(settings.volumePower);

  window.view.settingsAPI.onSetProperty((key: string, value: unknown) => {
    if (key in OnSet) {
      OnSet[key as keyof Setters](value as never);
    }
  });
};
