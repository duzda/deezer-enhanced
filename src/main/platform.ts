import { ipcMain } from 'electron';
import { PLATFORM_GET } from '../common/channels/platform';

export const createPlatformHandles = () => {
  ipcMain.handle(PLATFORM_GET, async () => {
    return process.platform;
  });
};
