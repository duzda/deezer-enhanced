import { Route, Routes, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';

import LogNavigation from './components/LogNavigation';
import LogPage from './pages/LogPage';
import LoginPage from './pages/LoginPage';
import { NOTIFICATIONS_TAG } from '../common/channels/notifications';
import Navigation from './components/Navigation';
import { NotificationData } from './components/Downloads/notifications';
import SettingsPage from './pages/SettingsPage';
import { currentSettingsAtom } from './states/atoms';

import './index.css';

const getStylesElement = () =>
  // oxlint-disable-next-line no-unsafe-type-assertion
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
  const navigate = useNavigate();

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
    // oxlint-disable-next-line exhaustive-deps
  }, [setNotificationsQueue]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
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
      (title, body, icon) =>
        new Notification(title, {
          body,
          icon,
          tag: NOTIFICATIONS_TAG,
        })
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
    window.renderer.loginAPI.onLogout(() => {
      navigate('/login');
    });

    window.renderer.loginAPI.onLogin(() => {
      navigate('/idle');
    });
  }, [navigate]);

  useEffect(() => {
    const updateSettings = async () => {
      setCurrentSettings(await window.renderer.settingsAPI.getSettings());
    };

    updateSettings();
  }, [setCurrentSettings]);

  return (
    <div>
      <Routes>
        <Route index element={null} />
        <Route path="login" element={null} />
        <Route
          path="idle"
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
        <Route path="login" element={<LoginPage />} />
        <Route path="idle" element={null} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="log" element={<LogPage />} />
      </Routes>
    </div>
  );
}

export default App;
