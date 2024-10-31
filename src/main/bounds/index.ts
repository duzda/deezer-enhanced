import { BaseWindow, app, screen } from 'electron';
import fs from 'fs';
import path from 'path';
import { env } from 'process';
import { Bounds, DEFAULT_BOUNDS, STEAMDECK_DEFAULT_BOUNDS } from './types';

const BOUNDS_FILE = path.join(app.getPath('userData'), 'bounds.json');

const isSteamDeck = () => {
  return env.XDG_CURRENT_DESKTOP === 'gamescope';
};

const loadFromFile = async (file: string) => {
  try {
    const data = fs.readFileSync(file, { encoding: 'utf-8' });
    return JSON.parse(data);
  } catch {
    return DEFAULT_BOUNDS;
  }
};

export const loadBounds = async (window: BaseWindow) => {
  let bounds = await loadFromFile(BOUNDS_FILE);

  if (isSteamDeck()) {
    bounds = STEAMDECK_DEFAULT_BOUNDS;
  }

  const allDisplaysSummaryWidth = screen
    .getAllDisplays()
    .reduce((acc, { size: { width } }) => acc + width, 0);

  if (bounds.bounds.x && allDisplaysSummaryWidth >= bounds.bounds.x) {
    window.setBounds(bounds.bounds);
  }

  if (bounds.maximized) {
    window.maximize();
  }

  window.show();
};

export const saveBounds = (window: BaseWindow) => {
  const newBounds: Bounds = {
    bounds: window.getBounds(),
    maximized: window.isMaximized(),
  };

  fs.writeFileSync(BOUNDS_FILE, JSON.stringify(newBounds, null, 4), {
    encoding: 'utf-8',
  });
};
