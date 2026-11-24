import { initializeMpris } from './injections/mpris';
import { initializeOfflineBanner } from './injections/offline_banner';
import { initializeSettings } from './settings';
import { initializeThemeSwitcher } from './injections/theme_switcher';
import { initializeVolumePower } from './injections/volume';
import { initializeVolumeScroll } from './injections/volume_scroll';
import { initializeZoom } from './injections/zoom';

const onStartup = () => {
  setTimeout(() => {
    initializeOfflineBanner();
    initializeMpris();
    initializeVolumePower();
    initializeVolumeScroll();
    initializeThemeSwitcher();
    initializeZoom();
    initializeSettings();
  }, 200);
};

export const initialize = () => {
  document.addEventListener('load', onStartup);
  const onDeezerLogin = () => {
    if (
      typeof window.dataLayer !== 'undefined' &&
      window.dataLayer.length > 0 &&
      window.dataLayer[0].deezer_user_id !== 0
    ) {
      onStartup();
    } else {
      setTimeout(onDeezerLogin, 100);
    }
  };

  setTimeout(onDeezerLogin, 100);
};
