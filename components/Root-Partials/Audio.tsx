"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "../icons";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { ToastAction } from "../ui/toast";
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
  const { toast } = useToast();
  const [playing, setPlaying] = useState<AudioButtonProps>("stopped");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioVolume, setAudioVolume] = useState<number>(100);

  const handleStop = useCallback(() => {
    setPlaying("stopped");

    toast({
      title: `Finished Playing:`,
      description: props.name,
      action: (
        <ToastAction
          onClick={() => {
            router.refresh();
          }}
          altText="Open in spotify"
        >
          Play Next!
        </ToastAction>
      ),
    });
  }, [props.name, router, toast]);

  const handlePlay = useCallback(() => {
    const ref = audioRef.current;

    if (ref?.src !== props.AudioSRC) {
      ref!.src = props.AudioSRC;
    }
    try {
      ref!.play();
      toast({
        title: `Now Playing: ${props.name}`,
        description: "Loading may take some time!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while playing the audio",
      });
    }
  }, [props.AudioSRC, props.name, toast]);

  const handlePause = useCallback(() => {
    const ref = audioRef.current;
    toast({
      title: `Audio Paused`,
      description: "You can resume anyways!",
    });
    ref!.pause();
  }, [toast]);

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
    const volume = window.localStorage.getItem("audioVolume");
    if (ref) {
      (ref.volume = Number(volume) / 100)
      setAudioVolume(Number(volume));
    }
  }, []);

  useEffect(() => {
    const ref = audioRef.current;
    if (ref) {
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
          <Slider className="p-2" onValueChange={(e) => {
            window.localStorage.setItem("audioVolume", e[0].toString());
            setAudioVolume(e[0]);
          }} defaultValue={[audioVolume!]} max={100} step={1} />
        </DropdownMenuContent>
      </DropdownMenu>

      <button
        onClick={() => {
          if (props.AudioSRC === null) {
            toast({
              title: "Ah snap :(",
              description: "This song doesn't have a preview",
              action: (
                <div className="flex flex-col gap-2 min-w-fit">
                  <ToastAction className="gap-3" altText="Open in spotify">
                    <div onClick={() => router.refresh()}>Play Next</div>
                  </ToastAction>
                  <ToastAction
                    className="inline-flex gap-3"
                    altText="Open in spotify"
                  >
                    <Link href={props.uri} target="inline-flex h-fit _blank">
                      Play in Spotify
                    </Link>
                  </ToastAction>
                </div>
              ),
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
