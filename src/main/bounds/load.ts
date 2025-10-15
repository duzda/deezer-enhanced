import { BaseWindow, screen } from 'electron';
import fs from 'fs';
import { env } from 'process';
import { BOUNDS_FILE, DEFAULT_BOUNDS, STEAMDECK_DEFAULT_BOUNDS } from './types';
import { getSettings } from '../settings';

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

  if (getSettings().enableTray && getSettings().startInTray) return;
  window.show();
};
