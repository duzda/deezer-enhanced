import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import SettingsPage from './pages/SettingsPage';
import Navigation from './components/Navigation';
import { currentSettingsAtom } from './states/atoms';
import LogPage from './pages/LogPage';
import LogNavigation from './components/LogNavigation';
import { NotificationData } from './components/Downloads/notifications';

import './index.css';

function App(): React.JSX.Element {
  const setCurrentSettings = useSetAtom(currentSettingsAtom);
  const [notificationsQueue] = useState<NotificationData[]>([]);

  // This is a dirty hack, but we never want to register new callback more than once. We somehow need to
  // update the array of notifications. React forces us to use setter function, which is bad, as it changes
  // the pointer. We avoid this issue by flushing into a buffer array and poll from it later, this way we,
  // never change the pointer, so no new callback ever gets registered.
  useEffect(() => {
    window.renderer.downloadsAPI.onDownloadFinished(
      async (status, url, stdout, stderr) => {
        notificationsQueue.push({ status, url, stdout, stderr });
      }
    );
  }, [notificationsQueue]);

  useEffect(() => {
    document.addEventListener('keydown', (event) => {
      event.preventDefault();
      window.renderer.keyboardAPI.sendKeypress({
        key: event.key,
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey,
      });
    });

    window.renderer.notificationsAPI.onNotificationCreate(
      (title, body, icon) => new Notification(title, { body, icon })
    );
  }, []);

  useEffect(() => {
    const updateSettings = async () => {
      setCurrentSettings(await window.renderer.settingsAPI.getSettings());
    };

    updateSettings();
  }, [setCurrentSettings]);

  return (
    <div>
      <Routes>
        <Route
          index
          element={<Navigation notificationsQueue={notificationsQueue} />}
        />
        <Route
          path="settings"
          element={<Navigation notificationsQueue={notificationsQueue} />}
        />
        <Route path="log" element={<LogNavigation />} />
      </Routes>
      <Routes>
        <Route index element={null} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="log" element={<LogPage />} />
      </Routes>
    </div>
  );
}

export default App;
