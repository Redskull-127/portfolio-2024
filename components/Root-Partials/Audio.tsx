"use client";
import { useRef, useState, useEffect } from "react";
import { Icons } from "../icons";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";
import Link from "next/link";
import { ToastAction } from "../ui/toast";

type AudioButtonType = {
  AudioSRC: string;
  name: string;
  uri: string;
};

export default function AudioButton(props: AudioButtonType) {
  const { toast } = useToast();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const ref = audioRef.current;

    function PauseEvent() {
      ref?.pause();
    }
    const EndedEvent = () => {
      setPlaying(false);
    };

    if (playing === false) {
      ref!.src = "";
      PauseEvent();
    }

    ref?.addEventListener("ended", EndedEvent);
    return () => {
      ref?.removeEventListener("ended", EndedEvent);
    };
  }, [playing]);

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

    if (playing) {
      spotifyImageAnimation();
    } else {
      undoImageAnimation();
    }

    return () => {
      spotifyImageAnimation();
      undoImageAnimation();
    };
  }, [playing]);

  return (
    <>
      <button
        onClick={() => {
          if (props.AudioSRC === null) {
            toast({
              title: "Ah snap :(",
              description: "This song doesn't have a preview",
              action: (
                <ToastAction altText="Open in spotify">
                  <Link href={props.uri} target="_blank">
                    Open in Spotify
                  </Link>
                </ToastAction>
              ),
            });
            return;
          }
          setPlaying(!playing);
          if (!playing && audioRef.current && document) {
            try {
              const audio = document.getElementById(
                "spotifyAudio"
              ) as HTMLAudioElement;
              audio.src = props.AudioSRC.toString();
              if (audioRef.current.src !== "null") {
                audioRef.current?.play();
                toast({
                  title: `Now Playing: ${props.name}`,
                  description: "Loading may take some time!",
                });
              }
            } catch (error) {
              toast({
                title: "Error",
                description: "Something went wrong while playing the audio",
              });
            }
          }
        }}
        className="disabled:opacity-75 bg-foreground text-primary-foreground p-3 rounded-full active:scale-90 transition-all duration-200"
      >
        {playing ? <Icons.Pause /> : <Icons.Play className="pl-1" />}
      </button>
      <audio id="spotifyAudio" ref={audioRef} className="hidden"></audio>
    </>
  );
}
