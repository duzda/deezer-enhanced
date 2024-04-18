type Artist = {
  ARTISTS_SONGS_ORDER: string; // number
  ARTIST_IS_DUMMY: boolean;
  ART_ID: string; // number
  ART_NAME: string;
  ART_PICTURE: string; // number
  LOCALES: {
    lang_en: {
      name: string;
    };
  };
  RANK: string; // number
  ROLE_ID: string; // number
  __TYPE__: 'artist';
};

type Media = {
  HREF: string;
  TYPE: string;
};

type Rights = {
  STREAM_ADS_AVAILABLE: boolean;
  STREAM_ADS: string; // Date
  STREAM_SUB_AVAILABLE: boolean;
  STREAM_SUB: string; // Date
};

type SongContributors = {
  composer: Array<string>;
  main_artist: Array<string>;
};

export type Song = {
  ALB_ID: string; // number
  ALB_PICTURE: string;
  ALB_TITLE: string;
  ARTISTS?: Array<Artist>;
  ART_ID: string; // number
  ART_NAME: string;
  DIGITAL_RELEASE_DATE: string; // Date
  DISK_NUMBER: string; // number
  DURATION: string; // number
  EXPLICIT_LYRICS: string; // number
  EXPLICIT_TRACK_CONTENT: {
    EXPLICIT_LYRICS_STATUS: number;
    EXPLICIT_COVER_STATUS: number;
  };
  FILESIZE: string; // number
  FILESIZE_AAC_64: string; // number
  FILESIZE_FLAC: string; // number
  FILESIZE_MP3_64: string; // number
  FILESIZE_MP3_128: string; // number
  FILESIZE_MP3_256: string; // number
  FILESIZE_MP3_320: string; // number
  GAIN: string; // number
  GENRE_ID: string; // number
  HIERARCHICAL_TITLE: string;
  ISRC: string;
  LYRICS_ID: number;
  MD5_ORIGIN: string;
  MEDIA: Array<Media>;
  MEDIA_VERSION: string; // number
  PHYSICAL_RELEASE_DATE: string; // Date
  PROVIDER_ID: string; // number
  RANK_SNG: string; // number
  RIGHTS: Rights;
  SMARTRADIO: number;
  SNG_CONTRIBUTORS: SongContributors;
  SNG_ID: string; // number
  SNG_TITLE: string;
  STATUS: number;
  TRACK_NUMBER: string; // number,
  TRACK_TOKEN: string;
  TRACK_TOKEN_EXPIRE: number;
  TYPE: number;
  UID: string;
  USER_ID: number;
  VERSION: string;
  __TYPE__: 'song';
};
