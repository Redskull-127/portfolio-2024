// @ts-ignore
import { getLyrics as GetLyric, getSong } from "genius-lyrics-api";

export default async function getLyrics(song: string, artist: string) {
  const options = {
    apiKey: "-v197nJc5gDZTbhQAqMlmXIlxINJ3KSsW62XX-0y8guaChCzsOyGQabai0_bro5d",
    title: song,
    artist: artist,
    optimizeQuery: true,
  };
  const data = await GetLyric(options);
  return data as typeof data;
}
