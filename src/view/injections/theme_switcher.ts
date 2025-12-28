const LIGHT_STYLE = 'light';
const DARK_STYLE = 'dark';

const ACCENT_KEY = 'accentIdentifier';
const THEME_KEY = 'chakra-ui-color-mode';

const DARK_ONLY_ACCENTS: ReadonlyArray<string> = [
  'acid',
  'auroraBlaze',
  'emeraldEmber',
];

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
    window.view.themesAPI.setTheme(newTheme);
  };

  setColorScheme(colorSchemeQueryList);
  colorSchemeQueryList.addEventListener('change', setColorScheme);

  const originalLocalStorageSetItem = localStorage.setItem;
  // eslint-disable-next-line func-names
  localStorage.setItem = function (key, value) {
    if (key === ACCENT_KEY) {
      window.view.themesAPI.setAccent(value);
    } else if (key === THEME_KEY) {
      window.view.themesAPI.setTheme(value);
    }

    // eslint-disable-next-line prefer-rest-params
    originalLocalStorageSetItem.apply(localStorage, arguments);
  };
};
