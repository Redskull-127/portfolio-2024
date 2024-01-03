"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "../../icons/icons";
// @ts-ignore
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

type AudioButtonType = {
  AudioSRC: string;
  name: string;
  uri: string;
};

type AudioButtonProps = "playing" | "paused" | "stopped";

export default function AudioButton(props: AudioButtonType) {
  const router = useRouter();
  const [playing, setPlaying] = useState<AudioButtonProps>("stopped");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioVolume, setAudioVolume] = useState<number>(100);

  const handleStop = useCallback(() => {
    setPlaying("stopped");

    toast(`Finished Playing:`, {
      description: props.name,
      action: {
        label: "Play Next",
        onClick: () => {
          router.refresh();
        },
      },
    });
  }, [props.name, router]);

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
      toast("Error",{
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
    const ref = audioRef.current;
    if (ref) {
      ref.volume = audioVolume / 100;
    }
  }, [audioVolume]);

  useEffect(() => {
    if (!window.localStorage.getItem("audioVolume")) {
      window.localStorage.setItem("audioVolume", "100");
      setAudioVolume(100);
    }
  }, []);

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
              description: (
                <div className="gap-5">
                  <p>This song doesn&apos;t have a preview</p>
                  <Link href={props.uri}>Open in Spotify</Link>
                </div>
              ),
              action: {
                label: "Play Next!",
                onClick: () => {
                  router.refresh();
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
          <Icons.Pause />
        )}
      </button>

      <SkipForward
        onClick={() => {
          setPlaying("paused");
          return router.refresh();
        }}
        className="cursor-pointer h-5 w-5 "
      />
      <audio id="spotifyAudio" ref={audioRef} className="hidden"></audio>
    </div>
  );
}
