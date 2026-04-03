import { WebContentsView } from 'electron';
import { initializePlayer as initializeLinuxPlayer } from './linux';
import { initializeGlobalShortcuts } from './other';

export const initializeMedia = (
  toolbarView: WebContentsView,
  deezerView: WebContentsView
) => {
  if (process.platform === 'linux') {
    initializeLinuxPlayer(toolbarView, deezerView);
  } else {
    initializeGlobalShortcuts(toolbarView);
  }
};
