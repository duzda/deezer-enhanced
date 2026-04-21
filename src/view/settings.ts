import { Setters } from '../common/types/settings';
import { setVolumePower } from './injections/volume';

const OnSet: Setters = {
  enableTray: () => {},
  closeToTray: () => {},
  startInTray: () => {},
  enableNotifications: () => {},
  deemixIntegration: () => {},
  volumePower: (newValue) => setVolumePower(newValue),
  discordRPC: () => {},
  adblock: () => {},
  saveArl: () => {},
};

export const initializeSettings = async () => {
  const settings = await window.view.settingsAPI.getSettings();

  OnSet.enableTray(settings.enableTray);
  OnSet.closeToTray(settings.closeToTray);
  OnSet.startInTray(settings.startInTray);
  OnSet.enableNotifications(settings.enableNotifications);
  OnSet.deemixIntegration(settings.deemixIntegration);
  OnSet.volumePower(settings.volumePower);
  OnSet.discordRPC(settings.discordRPC);
  OnSet.saveArl(settings.saveArl);

  window.view.settingsAPI.onSetProperty((key, value) => {
    OnSet[key](value);
  });
};
