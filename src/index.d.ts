/* eslint-disable max-classes-per-file */

declare module 'mpris-service';
// source: https://github.com/topsuperdev/hifi_tidal

declare class InitOptions {
  name: string;

  identity: string;

  supportedUriSchemes: string[];

  supportedMimeTypes: string[];

  supportedInterfaces: string[];

  desktopEntry: string;
}

declare class Player {
  metadata: {
    'xesam:title': string;
    'xesam:artist': string[];
    'xesam:album': string;
    'mpris:artUrl': string;
    'mpris:length': number;
    'mpris:trackid': string;
    // other options
    [key: string]: string | number | string[] | object;
  };

  playbackStatus: string;

  identity: string;

  fullscreen: boolean;

  supportedUriSchemes: string[];

  supportedMimeTypes: string[];

  canQuit: boolean;

  canRaise: boolean;

  canSetFullscreen: boolean;

  hasTrackList: boolean;

  desktopEntry: string;

  loopStatus: string;

  shuffle: boolean;

  volume: number;

  canControl: boolean;

  canPause: boolean;

  canPlay: boolean;

  canSeek: boolean;

  canGoNext: boolean;

  canGoPrevious: boolean;

  rate: number;

  minimumRate: number;

  maximumRate: number;

  playlists: string[];

  activePlaylist: string;

  constructor(opts: { name: string; supportedInterfaces?: string[] });
  constructor(opts: InitOptions);

  getPosition(): number;
  isPlaying(): boolean;
  seeked(): void;
  getTrackIndex(trackId: number): number;
  getTrack(trackId: number): string;
  addTrack(track: object): void;
  removeTrack(trackId: number): number;
  getPlaylistIndex(playlistId: number): number;
  setPlaylists(playlists: object): void;
  setActivePlaylist(playlistId: number): void;
  objectPath(subpath: string): string;

  on(event: string | symbol, listener: (...args: object[]) => void): this;

  static PLAYBACK_STATUS_PLAYING = 'Playing';

  static PLAYBACK_STATUS_PAUSED = 'Paused';

  static PLAYBACK_STATUS_STOPPED = 'Stopped';

  static LOOP_STATUS_NONE = 'None';

  static LOOP_STATUS_TRACK = 'Track';

  static LOOP_STATUS_PLAYLIST = 'Playlist';
}
