import { ExecStatus } from 'src/common/types/deemix';
import { UUID } from 'crypto';
import { DownloadType } from './deezer';

export type DownloadNotificationData = {
  status: ExecStatus;
  type: DownloadType | null;
  display: string;
  stdout: string;
  stderr: string;
};

export type DownloadNotificationDisplayData = {
  status: ExecStatus;
  display: string;
  stdout: string;
  stderr: string;
};

export type NotificationData = {
  status: ExecStatus;
  url: string;
  stdout: string;
  stderr: string;
};

export type DownloadObject = { id: UUID } & DownloadNotificationData;
