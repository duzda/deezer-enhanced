import { atom } from 'jotai';
import { DEFAULT_SETTINGS, Settings } from '../../common/types/settings';
import {
  DownloadNotificationDisplayData,
  DownloadObject,
} from '../components/Downloads/notifications';

export const currentSettingsAtom = atom<Settings>(DEFAULT_SETTINGS);

export const currentLogAtom = atom<DownloadNotificationDisplayData>({
  status: 'Success',
  display: '',
  stdout: '',
  stderr: '',
});

export const currentNotificationsAtom = atom<DownloadObject[]>([]);

export const viewExpandedAtom = atom<boolean>(false);
