import Image from "next/image"

export default function SpotifyImage(url:{url:string}) {
    return <Image
    id="spotifyImage"
    className={"rounded-full shadow-[#248F68]"}
    src={url.url}
    width={96}
    height={96}
    alt="Spotify"
  />
}