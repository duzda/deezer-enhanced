export type Episode = {
  AVAILABLE: boolean;
  DURATION: string; // number
  EPISODE_DESCRIPTION: string;
  EPISODE_DIRECT_STREAM_URL: string;
  EPISODE_ID: string; // number
  EPISODE_PUBLISHED_TIMESTAMP: string; // number
  EPISODE_STATUS: string; // number
  EPISODE_TITLE: string;
  EPISODE_UPDATE_TIMESTAMP: string; // Date
  FILESIZE_MP3_32: string; // number
  FILESIZE_MP3_64: string; // number
  MD5_ORIGIN: string;
  SHOW_ART_MD5: string;
  SHOW_DESCRIPTION: string;
  SHOW_ID: string; // number
  SHOW_IS_ADVERTISING_ALLOWED: string; // number
  SHOW_IS_DIRECT_STREAM: string; // number
  SHOW_IS_EXPLICIT: string; // number
  SHOW_NAME: string;
  TRACK_TOKEN: string;
  TRACK_TOKEN_EXPIRE: number;
  UID: string;
  __TYPE__: 'episode';
};
