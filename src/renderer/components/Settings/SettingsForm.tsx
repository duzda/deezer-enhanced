import { useAtom } from 'jotai';
import { DEFAULT_SETTINGS, Settings } from '../../../common/types/settings';
import { currentSettingsAtom } from '../../states/atoms';
import Switch from './Switch';
import NumberInput from './NumberInput';
import StringInput from './StringInput';
import SliderInput from './SliderInput';
import HiddenStringInput from './HiddenStringInput';

const setValue = <K extends keyof Settings>(key: K, value: Settings[K]) =>
  window.renderer.settingsAPI.setSettingProperty(key, value);

function SettingsForm(): React.JSX.Element {
  const [currentSettings, setCurrentSettings] = useAtom(currentSettingsAtom);

  return (
    <>
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
        id="start-in-tray"
        state={currentSettings.startInTray}
        text="Start in tray"
        onChange={(newValue) => {
          setValue('startInTray', newValue);
          setCurrentSettings({ ...currentSettings, startInTray: newValue });
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
        id="adblock"
        state={currentSettings.adblock}
        text="Adblock (disables podcasts)"
        onChange={(newValue) => {
          setValue('adblock', newValue);
          setCurrentSettings({
            ...currentSettings,
            adblock: newValue,
          });
        }}
      />

      <div className="my-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-base-300" />
          <span className="text-sm font-bold uppercase opacity-70">
            DISCORD RPC
          </span>
          <div className="h-px flex-1 bg-base-300" />
        </div>
      </div>

      <Switch
        id="discord-rpc"
        state={currentSettings.discordRPC}
        text="Enable Discord RichPresence"
        onChange={(newValue) => {
          setValue('discordRPC', newValue);
          setCurrentSettings({
            ...currentSettings,
            discordRPC: newValue,
          });
        }}
      />

      <Switch
        id="discord-rpc-button"
        state={currentSettings.discordRPCButton}
        text="Title Button"
        onChange={(newValue) => {
          setValue('discordRPCButton', newValue);
          setCurrentSettings({
            ...currentSettings,
            discordRPCButton: newValue,
          });
        }}
      />

      <div className="my-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-base-300" />
          <span className="text-sm font-bold uppercase opacity-70">
            Last.fm
          </span>
          <div className="h-px flex-1 bg-base-300" />
        </div>
      </div>

      <Switch
        id="lastfm-scrobbling"
        state={currentSettings.lastfmEnabled}
        text="Enable Scrobbling"
        onChange={(newValue) => {
          setValue('lastfmEnabled', newValue);
          setCurrentSettings({
            ...currentSettings,
            lastfmEnabled: newValue,
          });
        }}
      />
      <StringInput
        id="lastfm-username"
        value={currentSettings.lastfmUsername}
        text="Username"
        onChange={(newValue) => {
          setValue('lastfmUsername', newValue);
          setCurrentSettings({
            ...currentSettings,
            lastfmUsername: newValue,
          });
        }}
      />
      <HiddenStringInput
        id="lastfm-password"
        value={currentSettings.lastfmPassword}
        text="Password"
        onChange={(newValue) => {
          setValue('lastfmPassword', newValue);
          setCurrentSettings({
            ...currentSettings,
            lastfmPassword: newValue,
          });
        }}
      />
      <StringInput
        id="lastfm-api-key"
        value={currentSettings.lastfmApiKey}
        text="API Key"
        onChange={(newValue) => {
          setValue('lastfmApiKey', newValue);
          setCurrentSettings({
            ...currentSettings,
            lastfmApiKey: newValue,
          });
        }}
      />
      <StringInput
        id="lastfm-api-secret"
        value={currentSettings.lastfmApiSecret}
        text="API Secret"
        onChange={(newValue) => {
          setValue('lastfmApiSecret', newValue);
          setCurrentSettings({
            ...currentSettings,
            lastfmApiSecret: newValue,
          });
        }}
      />
      <SliderInput
        id="lastfm-minimum-listened-percent"
        value={Number(currentSettings.lastfmMinimumListenedRequiredPercent)}
        text="Minimum listened percent"
        onChange={(newValue) => {
          setValue('lastfmMinimumListenedRequiredPercent', newValue);
          setCurrentSettings({
            ...currentSettings,
            lastfmMinimumListenedRequiredPercent: newValue,
          });
        }}
        min={20}
        max={60}
      />
      <button
        type="button"
        className="cursor-pointer font-bold text-primary"
        onClick={() => {
          setCurrentSettings({ ...DEFAULT_SETTINGS });
          window.renderer.settingsAPI.resetSettings();
        }}
      >
        Reset Settings
      </button>
    </>
  );
}

export default SettingsForm;
