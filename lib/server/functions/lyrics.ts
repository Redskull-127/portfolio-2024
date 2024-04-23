// @ts-ignore
import { getLyrics as GetLyric } from "genius-lyrics-api";
import { AxiosError } from "axios";

export default async function getLyrics(song: string, artist: string) {
  const options = {
    apiKey: process.env.GENIUS_ACCESS_TOKEN as string,
    title: song,
    artist: artist,
    optimizeQuery: true,
  };

  try {
    const data = await GetLyric(options);
    return data as typeof data;
  } catch (error: AxiosError | any) {
    console.error(error.message);
  }
}
