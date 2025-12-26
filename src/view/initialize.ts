import { initializeMpris } from './injections/mpris';
import { initializeOfflineBanner } from './injections/offlinebanner';
import { initializeThemeSwitcher } from './injections/themeswitcher';
import { initializeVolumePower } from './injections/volume';
import { initializeVolumeScroll } from './injections/volumeScroll';
import { initializeSettings } from './settings';
import { ViewWindow } from './types';

const onStartup = () => {
  setTimeout(() => {
    initializeOfflineBanner();
    initializeMpris();
    initializeVolumePower();
    initializeVolumeScroll();
    initializeThemeSwitcher();
    initializeSettings();
  }, 200);
};

export const initialize = () => {
  document.addEventListener('load', onStartup);
  const onDeezerLogin = () => {
    const deezerWindow: ViewWindow = window as ViewWindow;
    if (
      typeof deezerWindow.dataLayer !== 'undefined' &&
      deezerWindow.dataLayer.length > 0 &&
      deezerWindow.dataLayer[0].deezer_user_id !== 0
    ) {
      onStartup();
    } else {
      setTimeout(onDeezerLogin, 100);
    }
  };

  setTimeout(onDeezerLogin, 100);
};
