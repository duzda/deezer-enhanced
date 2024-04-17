import { atom } from 'recoil';
import { DEFAULT_SETTINGS, Settings } from '../../common/types/settings';

export const currentSettingsAtom = atom<Settings>({
  key: 'settings',
  default: DEFAULT_SETTINGS,
});
