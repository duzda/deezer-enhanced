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
  mainView: WebContentsView,
  view: WebContentsView
) => {
  const zoomFactor = mainView.webContents.getZoomFactor();
  mainView.setBounds({
    x: 0,
    y: 0,
    width: mainWindow.getBounds().width,
    height: mainWindow.getBounds().height,
  });
  view.setBounds({
    x: 0,
    y: NAVBAR_HEIGHT * zoomFactor,
    width: mainWindow.getBounds().width,
    height: mainWindow.getBounds().height - NAVBAR_HEIGHT * zoomFactor,
  });
};

const getNewZoomFactor = (view: WebContentsView, zoomType: ZoomType) => {
  const zoomFactor = view.webContents.getZoomFactor();
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

export const setZoomFactor = (view: WebContentsView, zoom: number) => {
  view.webContents.setZoomFactor(zoom);
};

export const handleZoom = (
  mainWindow: BaseWindow,
  mainView: WebContentsView,
  view: WebContentsView,
  zoomType: ZoomType
) => {
  const newZoomFactor = getNewZoomFactor(mainView, zoomType);
  setZoomFactor(mainView, newZoomFactor);
  setZoomFactor(view, newZoomFactor);
  onDimensionsChange(mainWindow, mainView, view);
};

export const initializeZoom = (
  mainWindow: BaseWindow,
  mainView: WebContentsView,
  view: WebContentsView
) => {
  ipcMain.on(ZOOM_SET, (_, zoomType: ZoomType) =>
    handleZoom(mainWindow, mainView, view, zoomType)
  );
};
