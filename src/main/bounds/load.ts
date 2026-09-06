import { BaseWindow, screen, WebContentsView } from 'electron';
import fs from 'fs';
import { env } from 'process';
import {
  Bounds,
  BOUNDS_FILE,
  DEFAULT_BOUNDS,
  STEAMDECK_DEFAULT_BOUNDS,
} from './types';
import { getSettings } from '../settings';
import { NAVBAR_HEIGHT } from '../utils/size';
import { setZoomFactor, onDimensionsChange } from '../zoom';

const isSteamDeck = () => {
  return env.XDG_CURRENT_DESKTOP === 'gamescope';
};

const loadFromFile = async (file: string): Promise<Bounds> => {
  try {
    const data = fs.readFileSync(file, { encoding: 'utf-8' });
    return JSON.parse(data);
  } catch {
    return DEFAULT_BOUNDS;
  }
};

export const loadBounds = async (
  window: BaseWindow,
  mainView: WebContentsView,
  view: WebContentsView
) => {
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

  const zoom = bounds.zoom ?? DEFAULT_BOUNDS.zoom;

  if (getSettings().enableTray && getSettings().startInTray) {
    const width = bounds.bounds.width ?? DEFAULT_BOUNDS.bounds.width;
    const height = bounds.bounds.height ?? DEFAULT_BOUNDS.bounds.height;

    view.setBounds({
      x: 0,
      y: NAVBAR_HEIGHT * zoom,
      width,
      height: height - NAVBAR_HEIGHT * zoom,
    });

    mainView.webContents.once('did-navigate', () =>
      setZoomFactor(mainView, zoom)
    );
    view.webContents.once('did-navigate', () => setZoomFactor(view, zoom));
    return;
  }

  window.show();

  // Window is now realized, getContentBounds() is reliable here (fixes
  // 0x0 sizing seen on Windows when queried before the window is shown)
  onDimensionsChange(window, mainView, view);

  mainView.webContents.once('did-navigate', () =>
    setZoomFactor(mainView, zoom)
  );
  view.webContents.once('did-navigate', () => setZoomFactor(view, zoom));
};
