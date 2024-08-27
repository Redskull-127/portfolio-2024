'use client';
import { SpotifySelfApi, SpotifyType } from '@/lib/server/functions/spotify';
import AudioButton from './Audio';
import SpotifyImage from './Spotify-image';
import { Icons } from '../../icons/icons';
import Link from 'next/link';
import LyricsButton from './LyricsButton';
import MarqueeText from './MarqueeText';
import { SocialMediaLinks } from '@/site-config';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useGetNewSong } from './Audio';

export default function SpotifyComponent({ props }: { props: SpotifyType }) {
  const [status, setStatus] = useState<'shuffle' | 'now-playing'>('shuffle');

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['spotifyData', status],
    queryFn: () => SpotifySelfApi(status),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    initialData: props,
  });

  if (isLoading) return <SpotifyComponentStatus status="loading" />;
  if (isError)
    return <SpotifyComponentStatus status="error" error={error.message} />;
  if (data) {
    return (
      <div
        id="spotify-card"
        className=" flex flex-col justify-between h-80 rounded-2xl max-xl:w-full xl:max-w-[24%] 2xl:max-w-[25%] w-full gap-5 bg-ternary-foreground p-6"
      >
        <div className="flex justify-between items-center">
          <Link
            href={SocialMediaLinks.spotify.playlist}
            target="_blank"
            className="flex text-2xl font-semibold text-ternary select-none cursor-pointer transition-all duration-200 hover:text-foreground"
          >
            Spotify <Icons.ArrowUpRight />
          </Link>
          <LyricsButton
            song={data.name}
            name={data.artist}
            lyrics={data.lyrics}
          />
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-3">
          <SpotifyImage url={String(data.images[1].url)} />
          <div className="overflow-x-auto whitespace-nowrap w-full overflow-hidden flex justify-center items-center">
            <MarqueeText text={data.name + ' - ' + data.artist} />
          </div>
        </div>
        <div className="w-full flex justify-center items-center">
          <AudioButton
            status={status}
            setStatus={setStatus}
            uri={data.uri!}
            AudioSRC={data.preview_url}
            name={data.name}
            image={data.images[1].url}
          />
        </div>
      </div>
    );
  }
}

export function SpotifyComponentStatus({
  status,
  error,
}: {
  status: 'loading' | 'error';
  error?: string;
}) {
  const { getNewSong } = useGetNewSong();
  const refetch = useCallback(async () => {
    await getNewSong();
  }, []);
  if (status === 'error') {
    toast.error('Failed to fetch data!', {
      description: error,
    });
  }
  return (
    <div
      id="spotify-card"
      className=" flex flex-col justify-between h-80 rounded-2xl max-xl:w-full xl:max-w-[24%] 2xl:max-w-[25%] w-full gap-5 bg-ternary-foreground p-6"
    >
      <div className="flex justify-between items-center">
        <Link
          href={SocialMediaLinks.spotify.playlist}
          target="_blank"
          className="flex text-2xl font-semibold text-ternary select-none cursor-pointer transition-all duration-200 hover:text-foreground"
        >
          Spotify <Icons.ArrowUpRight />
        </Link>
      </div>
      <div className="w-full flex flex-col justify-center items-center gap-3">
        <SpotifyImage url="https://i2o.scdn.co/image/ab67706c0000cfa301def0302dc84acc2568170b" />
        <div className="overflow-x-auto whitespace-nowrap w-full overflow-hidden flex justify-center items-center">
          <MarqueeText
            text={
              status === 'loading'
                ? 'Loading please wait...'
                : 'Something went wrong!'
            }
          />
        </div>
      </div>
      {status === 'error' ? (
        <div className="w-full flex justify-center items-center">
          <Button
            className={buttonVariants({})}
            onClick={async () => {
              toast.promise(refetch!(), {
                loading: 'Refetching...',
                success: 'Successfully refetched!',
                error: 'Failed to refetch!',
              });
            }}
          >
            <RefreshCcw className="size-5 mr-1" /> Refetch
          </Button>
        </div>
      ) : (
        <AudioButton
          disabled={true}
          uri={''}
          AudioSRC={''}
          name={'No Song Playing'}
          image="https://i2o.scdn.co/image/ab67706c0000cfa301def0302dc84acc2568170b"
        />
      )}
    </div>
  );
}
