import { initializeMedia as initializeMediaHandlers } from './linux';
import { initializeNavigator } from './navigator';

export const initializeMedia = async () => {
  initializeMediaHandlers();
  if ((await window.view.platformAPI.getPlatform()) !== 'linux') {
    initializeNavigator();
  }
};
