export type Bounds = {
  bounds: Partial<Electron.Rectangle>;
  maximized: boolean;
};

export const DEFAULT_BOUNDS: Bounds = {
  bounds: {
    width: 1280,
    height: 800,
  },
  maximized: false,
};

export const STEAMDECK_DEFAULT_BOUNDS: Bounds = {
  bounds: {
    x: 0,
    y: 0,
    width: 1280,
    height: 800,
  },
  maximized: true,
};
