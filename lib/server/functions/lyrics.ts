import Lyrics from "genius-lyrics"

export default async function getLyrics(song: string) {
  const LyricsClient = new Lyrics.Client()
  const songs = await LyricsClient.songs.search(song)
  const data = songs[0]
  return data as typeof data
}
