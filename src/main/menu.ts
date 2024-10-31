import { Menu, WebContentsView } from 'electron';

export const generateMenu = (
  view: WebContentsView,
  properties: Electron.ContextMenuParams
) =>
  Menu.buildFromTemplate([
    {
      id: 'Inspect Element',
      label: '&Inspect Element',
      click() {
        view.webContents.inspectElement(properties.x, properties.y);

        if (view.webContents.isDevToolsOpened()) {
          view.webContents.devToolsWebContents?.focus();
        }
      },
    },
  ]);
