import { BaseWindow, ipcMain, WebContentsView } from 'electron';
import { ZOOM_SET } from '../common/channels/zoom';
import { ZoomType } from '../common/types/zoom';
import { NAVBAR_HEIGHT } from './utils/size';

// https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/common/page/page_zoom.cc;l=13;drc=3458a77f8572bcbc3eff3f4e498074330b3d8c00
const ZOOM_STEPS: readonly number[] = [
  0.25,
  1 / 3,
  0.5,
  2 / 3,
  0.75,
  0.8,
  0.9,
  1.0,
  1.1,
  1.25,
  1.5,
  1.75,
  2.0,
  2.5,
  3.0,
];

const findIndex = (zoom: number) =>
  ZOOM_STEPS.findIndex((v) => Math.abs(v - zoom) <= 0.001);

const DEFAULT_ZOOM_INDEX = findIndex(1.0);

const clamp = (n: number) => Math.max(0, Math.min(n, ZOOM_STEPS.length - 1));

export const onDimensionsChange = (
  mainWindow: BaseWindow,
  toolbarView: WebContentsView,
  deezerView: WebContentsView
) => {
  const zoomFactor = toolbarView.webContents.getZoomFactor();
  toolbarView.setBounds({
    x: 0,
    y: 0,
    width: mainWindow.getBounds().width,
    height: mainWindow.getBounds().height,
  });
  deezerView.setBounds({
    x: 0,
    y: NAVBAR_HEIGHT * zoomFactor,
    width: mainWindow.getBounds().width,
    height: mainWindow.getBounds().height - NAVBAR_HEIGHT * zoomFactor,
  });
};

const getNewZoomFactor = (deezerView: WebContentsView, zoomType: ZoomType) => {
  const zoomFactor = deezerView.webContents.getZoomFactor();
  const currentZoomIndex = findIndex(zoomFactor);
  switch (zoomType) {
    case 'zoom-in':
      return ZOOM_STEPS[clamp(currentZoomIndex + 1)];
    case 'zoom-out':
      return ZOOM_STEPS[clamp(currentZoomIndex - 1)];
    case 'zoom-reset':
      return ZOOM_STEPS[DEFAULT_ZOOM_INDEX];
    default:
      throw Error(`Unexpected zoom type ${zoomType satisfies never}.`);
  }
};

export const setZoomFactor = (deezerView: WebContentsView, zoom: number) => {
  deezerView.webContents.setZoomFactor(zoom);
};

export const handleZoom = (
  mainWindow: BaseWindow,
  toolbarView: WebContentsView,
  deezerView: WebContentsView,
  zoomType: ZoomType
) => {
  const newZoomFactor = getNewZoomFactor(toolbarView, zoomType);
  setZoomFactor(toolbarView, newZoomFactor);
  setZoomFactor(deezerView, newZoomFactor);
  onDimensionsChange(mainWindow, toolbarView, deezerView);
};

export const initializeZoom = (
  mainWindow: BaseWindow,
  toolbarView: WebContentsView,
  deezerView: WebContentsView
) => {
  ipcMain.on(ZOOM_SET, (_, zoomType: ZoomType) =>
    handleZoom(mainWindow, toolbarView, deezerView, zoomType)
  );
};
