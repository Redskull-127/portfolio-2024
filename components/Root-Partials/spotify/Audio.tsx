'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Icons } from '../../icons/icons';
import { toast } from 'sonner';
import { SkipForward, VolumeX, Volume1, Volume2, Settings } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useCastContext } from '@/lib/client/providers/CastProvider';
import clsx from 'clsx';
import { SwitchModes } from '@/lib/server/functions/spotify-switch';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type AudioButtonType = {
  AudioSRC: string;
  name: string;
  uri: string;
  image: string;
  disabled?: boolean;
  status?: 'now-playing' | 'shuffle';
  setStatus?: React.Dispatch<React.SetStateAction<'shuffle' | 'now-playing'>>;
};

type AudioButtonProps = 'playing' | 'paused' | 'stopped' | 'new-song';

export default function AudioButton(props: AudioButtonType) {
  const { setCastDetails } = useCastContext();
  const [playing, setPlaying] = useState<AudioButtonProps>('stopped');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioVolume, setAudioVolume] = useState<number>();
  const [audioCurrDuration, setAudioCurrDuration] = useState<number>();
  const queryClient = useQueryClient();

  const getNewSong = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ['spotifyData'],
    });
  }, [queryClient]);

  const handleStop = useCallback(() => {
    setPlaying('stopped');
    toast(`Finished Playing:`, {
      description: props.name,
      action: {
        label: 'Play Next',
        onClick: async () => {
          if (props.status === 'now-playing') {
            return toast.info('Meer is currently listening to this song!', {
              description: 'Switch to shuffle mode to skip to the next song!',
            });
          } else {
            setPlaying('new-song');
            return toast.promise(getNewSong(), {
              loading: 'Loading next song...',
              success: 'Next song loaded!',
              error: 'Error loading next song!',
            });
          }
        },
      },
    });
  }, [getNewSong, props.name, props.status]);

  const handlePlay = useCallback(() => {
    const ref = audioRef.current;
    if (ref?.src !== props.AudioSRC) {
      ref!.src = props.AudioSRC;
    }
    try {
      ref!.play();
      toast(`Now Playing: ${props.name}`, {
        description: 'Loading may take some time!',
      });
    } catch (error) {
      toast('Error', {
        description: 'Something went wrong while playing the audio',
      });
    }
  }, [props.AudioSRC, props.name]);

  const handlePause = useCallback(() => {
    const ref = audioRef.current;
    toast(`Audio Paused`, {
      description: 'You can resume anyways!',
    });
    ref!.pause();
  }, []);

  const handleNewSong = useCallback(() => {
    const ref = audioRef.current;
    ref!.pause();
  }, []);

  useEffect(() => {
    const ref = audioRef.current;

    if (playing === 'playing') {
      handlePlay();
    }
    if (playing === 'paused') {
      handlePause();
    }
    if (playing === 'new-song') {
      handleNewSong();
    }
    ref?.addEventListener('ended', handleStop);
    return () => {
      ref?.removeEventListener('ended', handleStop);
    };
  }, [handlePause, handlePlay, handleStop, handleNewSong, playing]);

  useEffect(() => {
    const ref = audioRef.current;
    if (ref) {
      ref.addEventListener('timeupdate', () => {
        setAudioCurrDuration(ref.currentTime);
      });
    }
  }, []);

  useEffect(() => {
    if (props) {
      setCastDetails({
        src: props.AudioSRC,
        title: props.name,
        poster: props.image,
      });
    }
  }, [props, setCastDetails]);

  useEffect(() => {
    const spotifyImageAnimation = () => {
      if (typeof document !== 'undefined') {
        const spotifyImage = document.getElementById('spotifyImage');
        if (spotifyImage) {
          spotifyImage.classList.add('SpotifyImage');
        }
      }
    };

    const undoImageAnimation = () => {
      if (typeof document !== 'undefined') {
        const spotifyImage = document.getElementById('spotifyImage');
        if (spotifyImage) {
          spotifyImage.classList.remove('SpotifyImage');
        }
      }
    };

    if (playing === 'playing') {
      spotifyImageAnimation();
    } else {
      undoImageAnimation();
    }

    return () => {
      spotifyImageAnimation();
      undoImageAnimation();
    };
  }, [playing]);

  useEffect(() => {
    if (!window.localStorage.getItem('audioVolume')) {
      window.localStorage.setItem('audioVolume', '100');
      setAudioVolume(100);
    }
    setAudioVolume(Number(window.localStorage.getItem('audioVolume')));
  }, []);

  useEffect(() => {
    const ref = audioRef.current;
    if (ref && audioVolume) {
      ref.volume = audioVolume / 100;
    }
  }, [audioVolume]);

  return (
    <div className="w-full gap-7 flex justify-center items-center">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Settings className="cursor-pointer h-5 w-5 " />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="space-y-1">
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Tabs
            onValueChange={async (e) => {
              toast.promise(
                SwitchModes(e as 'shuffle' | 'now-playing', props.setStatus!),
                {
                  loading: 'Switching modes...',
                  success: `Switched to ${e} mode!`,
                  error:
                    e === 'shuffle'
                      ? 'Error switching to shuffle mode!'
                      : 'Ah snap! Meer is not playing currently :(',
                },
              );
            }}
            defaultValue={props.status ?? 'shuffle'}
          >
            <TabsList>
              <TabsTrigger value="shuffle">Shuffle</TabsTrigger>
              <TabsTrigger value="now-playing">Now Playing</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex p-2 gap-1">
            {audioVolume === 0 ? (
              <VolumeX className="size-5" />
            ) : audioVolume! < 50 ? (
              <Volume1 className="size-5" />
            ) : (
              <Volume2 className="size-5" />
            )}
            <Slider
              onValueChange={(e) => {
                window.localStorage.setItem('audioVolume', e[0].toString());
                setAudioVolume(e[0]);
              }}
              defaultValue={[audioVolume!]}
              max={100}
              step={1}
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <button
        disabled={props.disabled}
        onClick={() => {
          if (props.AudioSRC === null) {
            toast('Ah snap :(', {
              description: 'No audio to play!',
              action: {
                label: 'Play Next!',
                onClick: async () => {
                  return await getNewSong();
                },
              },
            });
            return;
          }
          setPlaying(playing === 'playing' ? 'paused' : 'playing');
        }}
        className="disabled:opacity-75 bg-foreground text-primary-foreground p-3 rounded-full active:scale-90 transition-all duration-200"
      >
        {playing === 'paused' ||
        playing === 'stopped' ||
        playing === 'new-song' ? (
          <Icons.Play className="pl-1" />
        ) : (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Icons.Pause />
            </HoverCardTrigger>

            <HoverCardContent>
              <input
                value={audioCurrDuration}
                max={audioRef.current?.duration}
                type="range"
                className="appearance-none w-full h-1 bg-foreground rounded-full outline-none"
                style={{
                  background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${(
                    (audioCurrDuration! / audioRef.current?.duration!) *
                    100
                  ).toString()}%, #535353 ${(
                    (audioCurrDuration! / audioRef.current?.duration!) *
                    100
                  ).toString()}%, #535353 100%)`,
                }}
                onChange={(e) => {
                  audioRef.current!.currentTime = Number(e.target.value);
                }}
              />
            </HoverCardContent>
          </HoverCard>
        )}
      </button>

      <SkipForward
        onClick={
          props.disabled
            ? () => {}
            : async () => {
                if (props.status === 'now-playing') {
                  return toast.info(
                    'Meer is currently listening to this song!',
                    {
                      description:
                        'Switch to shuffle mode to skip to the next song!',
                    },
                  );
                } else {
                  setPlaying('new-song');
                  return toast.promise(getNewSong(), {
                    loading: 'Loading next song...',
                    success: 'Next song loaded!',
                    error: 'Error loading next song!',
                  });
                }
              }
        }
        className={clsx(
          'h-5 w-5',
          props.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
      />
      <audio id="spotifyAudio" ref={audioRef} className="hidden"></audio>
    </div>
  );
}
