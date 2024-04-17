const SELECTOR = '[aria-label="Chromecast"]';

export const initializeChromecast = () => {
  const chromecastElement = document.querySelector(SELECTOR);

  if (chromecastElement) {
    (chromecastElement as HTMLButtonElement).hidden = true;
  }
};
