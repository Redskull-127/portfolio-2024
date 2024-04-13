"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { Icons } from "../../icons/icons";
import { toast } from "sonner";
import Link from "next/link";
import { SkipForward, Volume } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getNewSong } from "@/lib/server/functions/spotify";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useCastContext } from "@/lib/client/providers/CastProvider";

type AudioButtonType = {
  AudioSRC: string;
  name: string;
  uri: string;
};

type AudioButtonProps = "playing" | "paused" | "stopped";

export default function AudioButton(props: AudioButtonType) {
  const { setCastDetails } = useCastContext()
  const [playing, setPlaying] = useState<AudioButtonProps>("stopped");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioVolume, setAudioVolume] = useState<number>();
  const [audioCurrDuration, setAudioCurrDuration] = useState<number>();

  const handleStop = useCallback(() => {
    setPlaying("stopped");
    toast(`Finished Playing:`, {
      description: props.name,
      action: {
        label: "Play Next",
        onClick: async () => {
          await getNewSong();
        },
      },
    });
  }, [props.name]);

  const handlePlay = useCallback(() => {
    const ref = audioRef.current;
    if (ref?.src !== props.AudioSRC) {
      ref!.src = props.AudioSRC;
    }
    try {
      ref!.play();
      toast(`Now Playing: ${props.name}`, {
        description: "Loading may take some time!",
      });
    } catch (error) {
      toast("Error", {
        description: "Something went wrong while playing the audio",
      });
    }
  }, [props.AudioSRC, props.name]);

  const handlePause = useCallback(() => {
    const ref = audioRef.current;
    toast(`Audio Paused`, {
      description: "You can resume anyways!",
    });
    ref!.pause();
  }, []);

  useEffect(() => {
    const ref = audioRef.current;

    if (playing === "playing") {
      handlePlay();
    }
    if (playing === "paused") {
      handlePause();
    }
    ref?.addEventListener("ended", handleStop);
    return () => {
      ref?.removeEventListener("ended", handleStop);
    };
  }, [handlePause, handlePlay, handleStop, playing]);

  useEffect(() => {
    const ref = audioRef.current;
    if (ref) {
      ref.addEventListener("timeupdate", () => {
        setAudioCurrDuration(ref.currentTime);
      });
    }
  }, []);

  useEffect(() => {
    if(props) {
      setCastDetails({
        src: props.AudioSRC,
        title: props.name,
      })
    }
  }, [props, setCastDetails]);

  useEffect(() => {
    const spotifyImageAnimation = () => {
      if (typeof document !== "undefined") {
        const spotifyImage = document.getElementById("spotifyImage");
        if (spotifyImage) {
          spotifyImage.classList.add("SpotifyImage");
        }
      }
    };

    const undoImageAnimation = () => {
      if (typeof document !== "undefined") {
        const spotifyImage = document.getElementById("spotifyImage");
        if (spotifyImage) {
          spotifyImage.classList.remove("SpotifyImage");
        }
      }
    };

    if (playing === "playing") {
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
    if (!window.localStorage.getItem("audioVolume")) {
      window.localStorage.setItem("audioVolume", "100");
      setAudioVolume(100);
    }
    setAudioVolume(Number(window.localStorage.getItem("audioVolume")));
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
          <Volume className="cursor-pointer h-5 w-5 " />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Audio controls</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Slider
            className="p-2"
            onValueChange={(e) => {
              window.localStorage.setItem("audioVolume", e[0].toString());
              setAudioVolume(e[0]);
            }}
            defaultValue={[audioVolume!]}
            max={100}
            step={1}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <button
        onClick={() => {
          if (props.AudioSRC === null) {
            toast("Ah snap :(", {
              description: "No audio to play!",
              action: {
                label: "Play Next!",
                onClick: async () => {
                  return await getNewSong();
                },
              },
            });
            return;
          }
          setPlaying(playing === "playing" ? "paused" : "playing");
        }}
        className="disabled:opacity-75 bg-foreground text-primary-foreground p-3 rounded-full active:scale-90 transition-all duration-200"
      >
        {playing === "paused" || playing === "stopped" ? (
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
        onClick={async () => {
          setPlaying("paused");
          return await getNewSong();
        }}
        className="cursor-pointer h-5 w-5 "
      />
      <audio id="spotifyAudio" ref={audioRef} className="hidden"></audio>
    </div>
  );
}
