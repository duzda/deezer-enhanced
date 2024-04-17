import DownloadButton from './Downloads/DownloadButton';
import BackButton from './History/BackButton';
import ForwardButton from './History/ForwardButton';
import SettingsButton from './Settings/SettingsButton';

function Navigation(): React.JSX.Element {
  return (
    <nav className="navbar justify-between min-h-12">
      <div>
        <BackButton />
        <ForwardButton />
      </div>
      <div className="flex-row gap-4">
        <DownloadButton />
        <SettingsButton />
      </div>
    </nav>
  );
}

export default Navigation;
