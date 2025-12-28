const offlineBannerCss = `
div[data-testid='alert-AppOffline'] {
  display: none !important;
}
`;

const createStyle = () => {
  const style = document.createElement('style');
  style.innerText = offlineBannerCss;
  return style;
};

export const initializeOfflineBanner = () => {
  window.document.head.appendChild(createStyle());
};
