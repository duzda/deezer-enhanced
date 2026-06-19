import crypto from 'crypto';
import { getSettings } from './settings';

export const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';

let sessionKey: string | undefined;

const md5 = (str: string): string =>
  crypto.createHash('md5').update(str, 'utf8').digest('hex');

const buildSignature = (params: Record<string, string>): string => {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}${params[k]}`)
    .join('');
  return md5(`${sorted}${getSettings().lastfmApiSecret}`);
};

const postToLastfm = async (
  params: Record<string, string>
): Promise<Response> => {
  const sig = buildSignature(params);
  const body = new URLSearchParams({
    ...params,
    api_sig: sig,
    format: 'json',
  });
  return fetch(LASTFM_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
};

export const connectLastfm = async (): Promise<boolean> => {
  const { lastfmUsername, lastfmPassword, lastfmApiKey, lastfmEnabled } =
    getSettings();

  console.log(lastfmApiKey, lastfmEnabled, lastfmPassword, lastfmUsername);
  if (
    lastfmEnabled === false ||
    !lastfmUsername ||
    !lastfmPassword ||
    !lastfmApiKey
  ) {
    console.warn('[LastFM] Missing credentials, skipping connection.');
    return false;
  }

  try {
    const res = await postToLastfm({
      method: 'auth.getMobileSession',
      username: lastfmUsername,
      password: lastfmPassword,
      api_key: lastfmApiKey,
    });
    const data = await res.json();

    if (data.error) {
      console.warn(`[LastFM] Auth error ${data.error}: ${data.message}`);
      return false;
    }

    sessionKey = data.session.key;
    console.log('[LastFM] Connected.');
    return true;
  } catch (e) {
    console.warn('[LastFM] Connection failed.', e);
    return false;
  }
};

export const disconnectLastfm = () => {
  sessionKey = undefined;
};

export const isLastfmConnected = () => sessionKey !== undefined;

export const scrobbleLastfm = async (
  artist: string,
  title: string,
  album: string,
  duration: number,
  startedAt: number
): Promise<void> => {
  if (!sessionKey) return;
  if (duration < 30) return;

  const timestamp = Math.floor(startedAt / 1000);

  try {
    const res = await postToLastfm({
      method: 'track.scrobble',
      artist,
      track: title,
      album,
      duration: String(Math.floor(duration)),
      timestamp: String(timestamp),
      api_key: getSettings().lastfmApiKey,
      sk: sessionKey,
    });
    const data = await res.json();

    if (data.error) {
      console.warn(`[LastFM] Scrobble error ${data.error}: ${data.message}`);
    } else {
      console.log(`[LastFM] Scrobbled: ${artist} - ${title}`);
    }
  } catch (e) {
    console.warn('[LastFM] Scrobble failed.', e);
  }
};

export const setLastfmNowPlaying = async (
  artist: string,
  title: string,
  album: string,
  duration: number
): Promise<void> => {
  if (!sessionKey) return;

  try {
    await postToLastfm({
      method: 'track.updateNowPlaying',
      artist,
      track: title,
      album,
      duration: String(Math.floor(duration)),
      api_key: getSettings().lastfmApiKey,
      sk: sessionKey,
    });
    console.log(`[LastFM] Now playing: ${artist} - ${title}`);
  } catch (e) {
    console.warn('[LastFM] Now playing update failed.', e);
  }
};
