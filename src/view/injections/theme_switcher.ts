const LIGHT_STYLE = 'light';
const DARK_STYLE = 'dark';

const ACCENT_KEY = 'accentIdentifier';
const THEME_KEY = 'chakra-ui-color-mode';

const DARK_ONLY_ACCENTS: ReadonlyArray<string> = [
  'acid',
  'auroraBlaze',
  'emeraldEmber',
];

const buildCss = () => {
  const root = window.getComputedStyle(document.documentElement);
  return `
  :root {
    --background-primary: ${root.getPropertyValue('--background-primary')};
    --background-secondary: ${root.getPropertyValue('--background-secondary')};
    --text-primary: ${root.getPropertyValue('--text-primary')};
    --text-intermediate: ${root.getPropertyValue('--text-intermediate')};
    --tempo-colors-background-accent-primary-default: ${root.getPropertyValue('--tempo-colors-background-accent-primary-default')};
    --divider-secondary: ${root.getPropertyValue('--divider-secondary')};
  }`;
};

export const initializeThemeSwitcher = () => {
  const colorSchemeQueryList = window.matchMedia(
    '(prefers-color-scheme: dark)'
  );

  const setColorScheme = (e: MediaQueryList | MediaQueryListEvent) => {
    const currentAccent = localStorage.getItem(ACCENT_KEY);
    if (currentAccent !== null && DARK_ONLY_ACCENTS.includes(currentAccent)) {
      return;
    }

    const newTheme = e.matches ? DARK_STYLE : LIGHT_STYLE;
    document.documentElement.style.colorScheme = newTheme;
    document.documentElement.dataset.theme = newTheme;
    window.view.themesAPI.setStyle(buildCss());
  };

  colorSchemeQueryList.addEventListener('change', setColorScheme);

  const originalLocalStorageSetItem = localStorage.setItem;
  // eslint-disable-next-line func-names
  localStorage.setItem = function (key) {
    if (key === ACCENT_KEY) {
      window.view.themesAPI.setStyle(buildCss());
    } else if (key === THEME_KEY) {
      window.view.themesAPI.setStyle(buildCss());
    }

    // eslint-disable-next-line prefer-rest-params
    originalLocalStorageSetItem.apply(localStorage, arguments);
  };
};
