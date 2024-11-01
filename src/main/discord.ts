import { Client } from 'discord-rpc';

const CLIENT_ID = '1029062131326386256';

const PLAY_ICON =
  'https://raw.githubusercontent.com/duzda/deezer-enhanced/master/other/discord/playIcon.png';
const PAUSE_ICON =
  'https://raw.githubusercontent.com/duzda/deezer-enhanced/master/other/discord/pauseIcon.png';

const PLAYING_STRING = 'Playing';
const PAUSED_STRING = 'Paused';

let client: Client | undefined;

export const isDiscordEnabled = () => client !== undefined;

export const connectDiscord = async () => {
  client = new Client({
    transport: 'ipc',
  });

  try {
    await client.login({ clientId: CLIENT_ID });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Discord is not running, unable to connect.');
  }
};

export const disconnectDiscord = async () => {
  if (typeof client !== 'undefined') {
    await client.destroy();
  }
};

export const setDiscordActivity = async (
  title: string,
  artist: string,
  album: string,
  coverImage: string,
  isPlaying: boolean,
  position: number
) => {
  if (typeof client === 'undefined') {
    await connectDiscord();
  }

  if (typeof client !== 'undefined') {
    try {
      await client.setActivity({
        details: title,
        state: artist,
        startTimestamp: isPlaying ? Date.now() - position : undefined,
        largeImageKey: coverImage,
        largeImageText: album,
        smallImageKey: isPlaying ? PLAY_ICON : PAUSE_ICON,
        smallImageText: isPlaying ? PLAYING_STRING : PAUSED_STRING,
      });
    } catch {
      // eslint-disable-next-line no-console
      console.warn('Discord is not running, unable to change activity.');
    }
  }
};
