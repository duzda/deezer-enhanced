import { WebContentsView } from 'electron';

export const initializeMedia = async (
  toolbarView: WebContentsView,
  deezerView: WebContentsView
) => {
  if (process.platform === 'linux') {
    const lib = await import('./linux');
    lib.initializePlayer(toolbarView, deezerView);
  } else {
    const lib = await import('./other');
    lib.initializeGlobalShortcuts(deezerView);
  }
};
