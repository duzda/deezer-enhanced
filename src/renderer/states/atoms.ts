import { atom } from 'recoil';
import { DEFAULT_SETTINGS, Settings } from '../../common/types/settings';
import {
  DownloadNotificationDisplayData,
  DownloadObject,
} from '../components/Downloads/notifications';

export const currentSettingsAtom = atom<Settings>({
  key: 'settings',
  default: DEFAULT_SETTINGS,
});

export const currentLogAtom = atom<DownloadNotificationDisplayData>({
  key: 'log',
  default: {
    status: 'Success',
    display: '',
    stdout: '',
    stderr: '',
  },
});

export const currentNotificationsAtom = atom<DownloadObject[]>({
  key: 'notifications',
  default: [],
});

export const viewExpandedAtom = atom<boolean>({
  key: 'view-expanded',
  default: false,
});
