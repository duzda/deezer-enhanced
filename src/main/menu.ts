import { BaseWindow, Menu, WebContentsView } from 'electron';
import { handleZoom } from './zoom';

export const generateMenu = (
  mainWindow: BaseWindow,
  currentView: WebContentsView,
  mainView: WebContentsView,
  view: WebContentsView,
  properties: Electron.ContextMenuParams
) =>
  Menu.buildFromTemplate([
    {
      id: 'Inspect Element',
      label: '&Inspect Element',
      click() {
        currentView.webContents.inspectElement(properties.x, properties.y);

        if (currentView.webContents.isDevToolsOpened()) {
          currentView.webContents.devToolsWebContents?.focus();
        }
      },
    },
    {
      id: 'Reset Zoom',
      label: '&Reset Zoom',
      click() {
        handleZoom(mainWindow, mainView, view, 'zoom-reset');
      },
    },
  ]);
