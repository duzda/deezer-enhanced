export type ExecStatus = 'Success' | 'Warning' | 'Error';

export const WARNING_MESSAGES: ReadonlyArray<string> = [
  'Track not available on Deezer!',
  'Track not yet encoded!',
  'Track not yet encoded and no alternative found!',
  'Track not found at desired bitrate.',
  'Track not found at desired bitrate and no alternative found!',
  "Your account can't stream the track at the desired bitrate.",
  'Track is not available in Reality Audio 360.',
  "Track not available on deezer's servers!",
  "Track not available on deezer's servers and no alternative found!",
  'No space left on target drive, clean up some space for the tracks',
  "Track's album does not exsist, failed to gather info.",
  'You need to login to download tracks.',
  "Your account can't stream the track from your current country.",
  "Your account can't stream the track from your current country and no alternative found.",
];
