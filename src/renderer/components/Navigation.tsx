import DownloadButton from './Downloads/DownloadButton';
import NotificationManager from './Downloads/NotificationManager';
import { NotificationData } from './Downloads/notifications';
import BackButton from './History/BackButton';
import ForwardButton from './History/ForwardButton';
import SettingsButton from './Settings/SettingsButton';

type NavigationProps = {
  notificationsQueue: NotificationData[];
};

function Navigation({
  notificationsQueue,
}: NavigationProps): React.JSX.Element {
  return (
    <nav className="navbar justify-between min-h-12">
      <div>
        <BackButton
          onClick={() => {
            window.renderer.historyAPI.goBack();
          }}
        />
        <ForwardButton />
      </div>
      <NotificationManager notificationsQueue={notificationsQueue} />
      <div className="flex flex-row gap-4">
        <DownloadButton />
        <SettingsButton />
      </div>
    </nav>
  );
}

export default Navigation;
