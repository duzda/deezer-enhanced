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

const getTheme = () => {
  const theme = localStorage.getItem('theme');
  if (theme !== null) {
    return theme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const getAccent = () => localStorage.getItem('accent') || 'purple';

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

    window.renderer.themesAPI.onThemeChange((theme) => {
      document.documentElement.setAttribute(
        'data-theme',
        `${theme}-${getAccent()}`
      );
      localStorage.setItem('theme', theme);
    });

    window.renderer.themesAPI.onAccentChange((accent) => {
      document.documentElement.setAttribute(
        'data-theme',
        `${getTheme()}-${accent}`
      );
      localStorage.setItem('accent', accent);
    });

    document.documentElement.setAttribute(
      'data-theme',
      `${getTheme()}-${getAccent()}`
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
