import { ViewWindow } from '../types';
import { callWithRetries } from './poller';

const SELECTOR = '[aria-label="volume button"]';

export const initializeVolumeScroll = () => {
  callWithRetries(SELECTOR, (element) => {
    const viewWindow: ViewWindow = window as ViewWindow;
    (element as HTMLElement).addEventListener('wheel', (e) => {
      viewWindow.dzPlayer.control.setVolume(
        Math.min(
          Math.max(
            viewWindow.dzPlayer.getVolume() + e.deltaY * -0.0005660377358,
            0.0
          ),
          1.0
        )
      );
      e.preventDefault();
    });
  });
};
