import { WebContentsView } from 'electron';
import { initializePlayer as initializeLinuxPlayer } from './linux';
import { initializeGlobalShortcuts } from './other';

export const initializeMedia = (view: WebContentsView) => {
  if (process.platform === 'linux') {
    initializeLinuxPlayer(view);
  } else {
    initializeGlobalShortcuts(view);
  }
};
