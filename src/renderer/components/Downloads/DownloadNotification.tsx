import React, { useCallback } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { useNavigate } from 'react-router';
import { currentLogAtom, viewExpandedAtom } from '../../states/atoms';
import { ExecStatus } from '../../../common/types/deemix';
import { DownloadType } from './deezer';
import AlertIcon from './AlertIcon';
import { DownloadNotificationData } from './notifications';

type DownloadNotificationProps = {
  onClick: () => void;
} & DownloadNotificationData;

const DOWNLOAD_TYPE_MAP: ReadonlyMap<DownloadType, string> = new Map([
  ['track', 'Track'],
  ['album', 'Album'],
  ['playlist', 'Playlist'],
  ['artist', 'Artist'],
  ['artist_discography', "Artist's discography"],
  ['artist_top', "Artist's top songs"],
]);

const ALERT_CLASSNAME_MAP: ReadonlyMap<ExecStatus, string> = new Map([
  ['Success', 'alert alert-success'],
  ['Warning', 'alert alert-warning'],
  ['Error', 'alert alert-error'],
]);

const STATUS_STRING_MAP: ReadonlyMap<ExecStatus, string> = new Map([
  ['Success', 'has been downloaded.'],
  ['Warning', "couldn't be fully downloaded, view log for more."],
  ['Error', 'crashed during downloading, view log for more.'],
]);

const generateAlert = (
  content: string,
  status: ExecStatus,
  className: string,
  onClose: () => void,
  onLog: () => void
) => {
  return (
    <div role="alert" className={className}>
      <AlertIcon status={status} />
      <span>{content}</span>
      <button type="button" className="btn btn-sm" onClick={onLog}>
        Log
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg>
      </button>
      <button type="button" className="btn btn-sm" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export function DownloadNotification({
  status,
  type,
  display,
  stdout,
  stderr,
  onClick,
}: DownloadNotificationProps): React.JSX.Element {
  const navigate = useNavigate();
  const setCurrentLog = useSetAtom(currentLogAtom);
  const [viewExpanded, setViewExpanded] = useAtom(viewExpandedAtom);

  const onLog = useCallback(() => {
    setCurrentLog({
      display,
      status,
      stdout,
      stderr,
    });

    navigate('/log');
    if (!viewExpanded) {
      setViewExpanded(true);
      window.renderer.settingsAPI.showSettings();
    }
  }, [
    display,
    navigate,
    setCurrentLog,
    setViewExpanded,
    status,
    stderr,
    stdout,
    viewExpanded,
  ]);

  const className = ALERT_CLASSNAME_MAP.get(status)!;
  const statusString = STATUS_STRING_MAP.get(status);
  if (type === null) {
    return generateAlert(
      `${display} ${statusString}`,
      status,
      className,
      onClick,
      onLog
    );
  }

  const typeString = DOWNLOAD_TYPE_MAP.get(type);
  return generateAlert(
    `${typeString} ${display} ${statusString}`,
    status,
    className,
    onClick,
    onLog
  );
}
