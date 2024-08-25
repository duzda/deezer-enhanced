// API types, these are incomplete, as we don't need the rest
// https://developers.deezer.com/api

type ArtistApi = {
  name: string;
};

type PlaylistApi = {
  title: string;
};

type AlbumApi = {
  title: string;
  artist: ArtistApi;
};

type TrackApi = {
  title: string;
  artist: ArtistApi;
  album: AlbumApi;
};

export type DownloadType =
  | 'track'
  | 'album'
  | 'playlist'
  | 'artist'
  | 'artist_discography'
  | 'artist_top';

export type ContentType = {
  type: DownloadType | null;
  contentId: string;
};

export const getContentType = (url: string): ContentType => {
  let type: DownloadType | null = null;
  let contentId = '';
  if (url.includes('/playlist')) {
    type = 'playlist';
    contentId = Array.from(
      url.matchAll(/playlist\/(\d+)/g),
      (m) => m[1]
    ).toString();
  } else if (url.includes('/album')) {
    type = 'album';
    contentId = Array.from(
      url.matchAll(/album\/(\d+)/g),
      (m) => m[1]
    ).toString();
  } else if (url.search(/artist\/(\d+)\/top_track/g)) {
    type = 'artist_top';
    contentId = Array.from(
      url.matchAll(/artist\/(\d+)\/top_track/g),
      (m) => m[1]
    ).toString();
  } else if (url.search(/artist\/(\d+)\/discography/g)) {
    type = 'artist_discography';
    contentId = Array.from(
      url.matchAll(/artist\/(\d+)\/discography/g),
      (m) => m[1]
    ).toString();
  } else if (url.includes('/artist')) {
    type = 'artist';
    contentId = Array.from(
      url.matchAll(/artist\/(\d+)/g),
      (m) => m[1]
    ).toString();
  }

  return {
    type,
    contentId,
  };
};

const getApiUrl = (type: DownloadType, contentId: string): string => {
  switch (type) {
    case 'track':
      return `https://api.deezer.com/track/${contentId}`;
    case 'album':
      return `https://api.deezer.com/album/${contentId}`;
    case 'playlist':
      return `https://api.deezer.com/playlist/${contentId}`;
    default:
      return `https://api.deezer.com/artist/${contentId}`;
  }
};

const fetchContent = async <
  T extends TrackApi | AlbumApi | PlaylistApi | ArtistApi,
>(
  type: DownloadType,
  id: string
): Promise<T> => {
  const response = await fetch(getApiUrl(type, id));
  const json = await response.json();
  return json;
};

export const fetchDisplayName = async (
  type: DownloadType,
  contentId: string
): Promise<string> => {
  if (type === 'track') {
    const track = await fetchContent<TrackApi>(type, contentId);
    return `${track.title} by ${track.artist.name}`;
  }

  if (type === 'album') {
    const album = await fetchContent<AlbumApi>(type, contentId);
    return `${album.title} by ${album.artist.name}`;
  }

  if (type === 'playlist') {
    const playlist = await fetchContent<PlaylistApi>(type, contentId);
    return playlist.title;
  }

  const artist = await fetchContent<ArtistApi>(type, contentId);
  return artist.name;
};
