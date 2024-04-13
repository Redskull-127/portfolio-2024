import { Client } from "genius-lyrics"

export default async function getLyrics(song: string) {
  const LyricsClient = new Client()
  const songs = await LyricsClient.songs.search(song)
  const data = songs[0]
  return data as typeof data
}
