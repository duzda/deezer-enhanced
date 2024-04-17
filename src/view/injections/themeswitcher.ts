const LIGHT_STYLE = 'light';
const DARK_STYLE = 'dark';

export const initializeThemeSwitcher = () => {
  const colorSchemeQueryList = window.matchMedia(
    '(prefers-color-scheme: dark)'
  );

  const setColorScheme = (e: MediaQueryList | MediaQueryListEvent) => {
    document.documentElement.style.colorScheme = e.matches
      ? DARK_STYLE
      : LIGHT_STYLE;
    document.documentElement.dataset.theme = e.matches
      ? DARK_STYLE
      : LIGHT_STYLE;
  };

  setColorScheme(colorSchemeQueryList);
  colorSchemeQueryList.addEventListener('change', setColorScheme);
};
