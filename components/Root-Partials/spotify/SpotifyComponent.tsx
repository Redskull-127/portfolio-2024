import { SpotifyType } from '@/lib/server/functions/spotify';
import AudioButton from './Audio';
import SpotifyImage from './Spotify-image';
import { Icons } from '../../icons/icons';
import Link from 'next/link';
import LyricsButton from './LyricsButton';
import getLyrics from '@/lib/server/functions/lyrics';
import MarqueeText from './MarqueeText';

export default async function SpotifyComponent(props: SpotifyType) {
  const lyrics = await getLyrics(props.name, props.artist);
  return (
    <div
      id="spotify-card"
      className=" flex flex-col justify-between h-80 rounded-2xl max-xl:w-full xl:max-w-[24%] 2xl:max-w-[25%] w-full gap-5 bg-ternary-foreground p-6"
    >
      <div className="flex justify-between items-center">
        <Link
          href={
            'https://open.spotify.com/playlist/42h3IewUsTfRNHE5Puw9EK?si=dc5d84399b814878'
          }
          target="_blank"
          className="flex text-2xl font-semibold text-ternary select-none cursor-pointer transition-all duration-200 hover:text-foreground"
        >
          Spotify <Icons.ArrowUpRight />
        </Link>
        <LyricsButton song={props.name} name={props.artist} lyrics={lyrics} />
      </div>
      <div className="w-full flex flex-col justify-center items-center gap-3">
        <SpotifyImage url={String(props.images[1].url)} />
        <div className="overflow-x-auto whitespace-nowrap w-full overflow-hidden flex justify-center items-center">
          <MarqueeText text={props.name + ' - ' + props.artist} />
        </div>
      </div>
      <div className="w-full flex justify-center items-center">
        <AudioButton
          uri={props.uri!}
          AudioSRC={props.preview_url}
          name={props.name}
          image={props.images[1].url}
        />
      </div>
    </div>
  );
}
