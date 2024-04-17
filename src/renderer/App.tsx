import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import SettingsPage from './pages/SettingsPage';
import Navigation from './components/Navigation';
import { currentSettingsAtom } from './states/atoms';

import './index.css';

function App(): React.JSX.Element {
  const navigate = useNavigate();
  const setCurrentSettings = useSetRecoilState(currentSettingsAtom);

  useEffect(() => {
    window.renderer.settingsAPI.onShowSettings(() => {
      navigate('/settings');
    });

    window.renderer.settingsAPI.onHideSettings(() => {
      navigate('/');
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
      <Navigation />
      <Routes>
        <Route index element={null} />
        <Route path="settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;
