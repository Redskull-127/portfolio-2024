import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Suspense } from 'react';

export default function SpotifyImage(url: { url: string }) {
  return (
    <Suspense
      fallback={<Skeleton className="w-[96px] h-[96px] rounded-full" />}
    >
      <Image
        id="spotifyImage"
        className={'rounded-full shadow-[#248F68]'}
        src={url.url}
        width={96}
        height={96}
        alt="Spotify"
      />
    </Suspense>
  );
}
