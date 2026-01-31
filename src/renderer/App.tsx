import { Route, Routes } from 'react-router';
import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import SettingsPage from './pages/SettingsPage';
import Navigation from './components/Navigation';
import { currentSettingsAtom } from './states/atoms';
import LogPage from './pages/LogPage';
import LogNavigation from './components/LogNavigation';
import { NotificationData } from './components/Downloads/notifications';

import './index.css';

const getStylesElement = () =>
  document.getElementById('inject-styles')! as HTMLStyleElement;

const getStyles = () =>
  localStorage.getItem('style') ||
  `
    :root {
      --background-primary: rgb(0, 0, 0);
      --background-secondary: rgb(20, 18, 22);
      --text-primary: rgb(255, 255, 255);
      --text-intermediate: rgb(255, 255, 255);
      --tempo-colors-background-accent-primary-default: rgb(187, 115, 255);
      --divider-secondary: rgb(56, 55, 59);
    }
  `;

function App(): React.JSX.Element {
  const setCurrentSettings = useSetAtom(currentSettingsAtom);

  const [notificationsQueue, setNotificationsQueue] = useState<
    NotificationData[]
  >([]);

  useEffect(() => {
    window.renderer.downloadsAPI.onDownloadFinished(
      async (status, url, stdout, stderr) => {
        setNotificationsQueue([
          ...notificationsQueue,
          { status, url, stdout, stderr },
        ]);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setNotificationsQueue]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      event.preventDefault();
      window.renderer.keyboardAPI.sendKeypress({
        key: event.key,
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey,
      });
    };

    document.addEventListener('keydown', handleKeydown);

    window.renderer.notificationsAPI.onNotificationCreate(
      (title, body, icon) => new Notification(title, { body, icon })
    );

    window.renderer.themesAPI.onStyleChange((style) => {
      getStylesElement().innerHTML = style;
      localStorage.setItem('style', style);
    });

    getStylesElement().innerHTML = getStyles();
    document.documentElement.setAttribute('data-theme', `custom`);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
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
