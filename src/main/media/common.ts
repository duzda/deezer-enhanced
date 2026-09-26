import { Song } from '../../common/types/deezer';

export const showArtist = (data: Song) =>
  data.ARTISTS !== undefined
    ? data.ARTISTS.map((artist) => artist.ART_NAME)
    : [data.ART_NAME];
