export const initializeZoom = () => {
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.ctrlKey) {
      switch (event.key) {
        case '=':
          window.view.zoomAPI.zoom('zoom-in');
          break;
        case '-':
          window.view.zoomAPI.zoom('zoom-out');
          break;
        case '0':
          window.view.zoomAPI.zoom('zoom-reset');
          break;
        default:
          break;
      }
    }
  });
};
