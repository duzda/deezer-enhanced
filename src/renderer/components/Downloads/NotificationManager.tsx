import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { currentNotificationsAtom } from '../../states/atoms';
import { DownloadNotification } from './DownloadNotification';
import { fetchDisplayName, getContentType } from './deezer';
import { DownloadObject, NotificationData } from './notifications';

const transformNotification = async ({
  status,
  url,
  stdout,
  stderr,
}: NotificationData): Promise<DownloadObject> => {
  try {
    const { type, contentId } = getContentType(url);
    if (type === null) {
      return {
        id: window.crypto.randomUUID(),
        status: 'Error',
        type: null,
        display: url,
        stdout,
        stderr,
      };
    }

    const display = await fetchDisplayName(type, contentId);
    return {
      id: window.crypto.randomUUID(),
      status,
      type,
      display,
      stdout,
      stderr,
    };
  } catch (e) {
    return {
      id: window.crypto.randomUUID(),
      status,
      type: null,
      display: url,
      stdout,
      stderr,
    };
  }
};

type NotificationManagerProps = {
  notificationsQueue: NotificationData[];
};

function NotificationManager({
  notificationsQueue,
}: NotificationManagerProps): React.JSX.Element {
  const [notifications, setNotifications] = useAtom<DownloadObject[]>(
    currentNotificationsAtom
  );

  useEffect(() => {
    Promise.all(notificationsQueue.map(transformNotification)).then((n) =>
      setNotifications([...notifications, ...n])
    );
    // eslint-disable-next-line no-param-reassign
    notificationsQueue.length = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationsQueue]);

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 flex flex-row">
      <div className="container-lg mx-auto">
        <div className="flex flex-col gap-4">
          {notifications.map((n) => (
            <DownloadNotification
              key={n.id}
              status={n.status}
              type={n.type}
              display={n.display}
              stdout={n.stdout}
              stderr={n.stderr}
              onClick={() =>
                setNotifications(
                  notifications.filter((oldN) => n.id !== oldN.id)
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotificationManager;
