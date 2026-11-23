import { callWithRetries } from './poller';

const SELECTOR = '[aria-label="volume button"]';

export const initializeVolumeScroll = () => {
  callWithRetries(SELECTOR, (element) => {
    element.addEventListener('wheel', (e) => {
      window.dzPlayer.control.setVolume(
        Math.min(
          Math.max(
            window.dzPlayer.getVolume() + e.deltaY * -0.0005660377358,
            0.0
          ),
          1.0
        )
      );
      e.preventDefault();
    });
  });
};
