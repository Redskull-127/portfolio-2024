import { SpotifyType } from "@/lib/server/functions/spotify";
import AudioButton from "./Audio";
import SpotifyImage from "./Spotify-image";
import { Icons } from "../../icons/icons";
import Link from "next/link";

export default function SpotifyComponent(props: SpotifyType) {
  return (
    <div className="max-md:w-full max-md:h-fit flex flex-col justify-between h-80 rounded-2xl w-[25%] gap-5 bg-ternary-foreground p-6">
      <Link
        href={
          "https://open.spotify.com/playlist/42h3IewUsTfRNHE5Puw9EK?si=dc5d84399b814878"
        }
        target="_blank"
        className="flex text-2xl font-semibold text-ternary select-none cursor-pointer transition-all duration-200 hover:text-foreground"
      >
        Spotify <Icons.ArrowUpRight />
      </Link>
      <div className="w-full flex flex-col justify-center items-center gap-3">
        <SpotifyImage url={String(props.images[1].url)} />
        <h1 className="text-lg font-semibold text-center overflow-hidden w-full  truncate">
          {props.name} - <span className="text-opacity-50">{props.artist}</span>
        </h1>
        
      </div>
      <div className="w-full flex justify-center items-center">
        <AudioButton
          uri={props.uri}
          AudioSRC={props.preview_url}
          name={props.name}
        />
      </div>
    </div>
  );
}
