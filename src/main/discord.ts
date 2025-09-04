import { ActivityType, Client } from 'discord-rpc';

const CLIENT_ID = '1029062131326386256';

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
    try {
      await client.destroy();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Discord is already disconnected.');
    }
  }
};

export const setDiscordActivity = async (
  title: string,
  artist: string,
  album: string,
  coverImage: string,
  isPlaying: boolean,
  position: number,
  duration: number
) => {
  if (typeof client === 'undefined') {
    await connectDiscord();
  }

  if (typeof client !== 'undefined') {
    try {
      if (isPlaying) {
        await client.setActivity({
          details: title,
          state: artist,
          startTimestamp: Date.now() - position,
          endTimestamp: Date.now() + duration - position,
          largeImageKey: coverImage,
          largeImageText: album,
          activityType: ActivityType.Listening,
        });
      } else {
        await client.clearActivity();
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Discord is not running, unable to change activity.');
      // eslint-disable-next-line no-console
      console.warn(e);
    }
  }
};
