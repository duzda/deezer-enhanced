import fs from 'fs';
import { BaseWindow } from 'electron';
import { Bounds, BOUNDS_FILE } from './types';

export const saveBounds = (window: BaseWindow) => {
  const newBounds: Bounds = {
    bounds: window.getBounds(),
    maximized: window.isMaximized(),
  };

  fs.writeFileSync(BOUNDS_FILE, JSON.stringify(newBounds, null, 4), {
    encoding: 'utf-8',
  });
};
