import { callWithRetries } from './poller';

const SELECTOR = '[aria-label="Chromecast"]';

export const initializeChromecast = () => {
  callWithRetries(SELECTOR, (element) => {
    const elementReference = element;
    elementReference.hidden = true;
  });
};
