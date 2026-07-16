import fs from 'fs';
import { BaseWindow, WebContentsView } from 'electron';
import { Bounds, BOUNDS_FILE } from './types';

export const saveBounds = (window: BaseWindow, deezerView: WebContentsView) => {
  const newBounds: Bounds = {
    bounds: window.getBounds(),
    maximized: window.isMaximized(),
    zoom: deezerView.webContents.zoomFactor,
  };

  fs.writeFileSync(BOUNDS_FILE, JSON.stringify(newBounds, null, 4), {
    encoding: 'utf-8',
  });
};
