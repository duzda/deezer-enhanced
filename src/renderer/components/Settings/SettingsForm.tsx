import { useRecoilState } from 'recoil';
import {
  DEFAULT_SETTINGS,
  SettingsProperties,
} from '../../../common/types/settings';
import { currentSettingsAtom } from '../../states/atoms';
import Switch from './Switch';
import NumberInput from './NumberInput';

const setValue = (key: SettingsProperties, value: unknown) =>
  window.renderer.settingsAPI.setSettingProperty(key, value);

function SettingsForm(): React.JSX.Element {
  const [currentSettings, setCurrentSettings] =
    useRecoilState(currentSettingsAtom);

  return (
    <div className="flex flex-row">
      <div className="min-w-96 w-4/5 mx-auto my-8 flex flex-col gap-4 bg-base-200 p-8 rounded-md border-2 border-neutral">
        <Switch
          id="enable-tray"
          state={currentSettings.enableTray}
          text="Enable tray"
          onChange={(newValue) => {
            setValue('enableTray', newValue);
            setCurrentSettings({ ...currentSettings, enableTray: newValue });
          }}
        />
        <Switch
          id="close-to-tray"
          state={currentSettings.closeToTray}
          text="Close to tray"
          onChange={(newValue) => {
            setValue('closeToTray', newValue);
            setCurrentSettings({ ...currentSettings, closeToTray: newValue });
          }}
        />
        <Switch
          id="enable-notifications"
          state={currentSettings.enableNotifications}
          text="Enable notifications on song change"
          onChange={(newValue) => {
            setValue('enableNotifications', newValue);
            setCurrentSettings({
              ...currentSettings,
              enableNotifications: newValue,
            });
          }}
        />
        <Switch
          id="deemix-integration"
          state={currentSettings.deemixIntegration}
          text="Enable Deemix integration"
          onChange={(newValue) => {
            setValue('deemixIntegration', newValue);
            setCurrentSettings({
              ...currentSettings,
              deemixIntegration: newValue,
            });
          }}
        />
        <NumberInput
          id="volume-power"
          value={currentSettings.volumePower.toString()}
          text="Non-linear volume control"
          onChange={(newValue) => {
            setValue('volumePower', newValue);
            setCurrentSettings({
              ...currentSettings,
              volumePower: newValue,
            });
          }}
        />
        <Switch
          id="discord-rpc"
          state={currentSettings.discordRPC}
          text="Discord RPC"
          onChange={(newValue) => {
            setValue('discordRPC', newValue);
            setCurrentSettings({ ...currentSettings, discordRPC: newValue });
          }}
        />
        <button
          type="button"
          className="font-bold text-primary"
          onClick={() => {
            setCurrentSettings({ ...DEFAULT_SETTINGS });
            window.renderer.settingsAPI.resetSettings();
          }}
        >
          Reset Settings
        </button>
      </div>
    </div>
  );
}

export default SettingsForm;
