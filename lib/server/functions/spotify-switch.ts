import { getNowPlaying, getRecentlyPlayed } from './spotify';

export async function SwitchModes(
  mode: 'shuffle' | 'now-playing',
  setStatus: React.Dispatch<React.SetStateAction<'shuffle' | 'now-playing'>>,
) {
  if (mode === 'shuffle') {
    const data = await getRecentlyPlayed();
    if (data instanceof Error) {
      return Error('Something went wrong!');
    }
    return setStatus('shuffle');
  }
  if (mode === 'now-playing') {
    const data = await getNowPlaying();
    if (data instanceof Error) {
      return Error('Sorry, Meer is not playing currently :(');
    }
    return setStatus('now-playing');
  }
}
