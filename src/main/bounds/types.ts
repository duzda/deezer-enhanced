import path from 'path';
import { app } from 'electron';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '../utils/size';

export const BOUNDS_FILE = path.join(app.getPath('userData'), 'bounds.json');

export type Bounds = {
  bounds: Partial<Electron.Rectangle>;
  maximized: boolean;
};

export const DEFAULT_BOUNDS: Bounds = {
  bounds: {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  maximized: false,
};

export const STEAMDECK_DEFAULT_BOUNDS: Bounds = {
  bounds: {
    x: 0,
    y: 0,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  maximized: true,
};
