"use client";
import { useRef, useState, useEffect } from "react";
import { Icons } from "../icons";
import { useToast } from "@/components/ui/use-toast";

type AudioButtonType = {
  AudioSRC: string;
  name: string;
};

export default function AudioButton(props: AudioButtonType) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  useEffect(() => {
    const ref = audioRef.current;

    function PauseEvent() {
      ref?.pause();
    }
    const EndedEvent = () => {
      setPlaying(false);
    };

    if (playing === false) {
      PauseEvent();
    }

    ref?.addEventListener("ended", EndedEvent);
    return () => {
      ref?.removeEventListener("ended", EndedEvent);
    };
  }, [playing]);

  useEffect(() => {
    const spotifyImageAnimation = () => {
      if(typeof document !== "undefined"){
        const spotifyImage = document.getElementById("spotifyImage");
        if (spotifyImage) {
          spotifyImage.classList.add("SpotifyImage");
        }
      }
    }

    const undoImageAnimation = () => {
      if(typeof document !== "undefined"){
        const spotifyImage = document.getElementById("spotifyImage");
        if (spotifyImage) {
          spotifyImage.classList.remove("SpotifyImage");
        }
      }
    }

    if(playing){
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
          setPlaying(!playing);
          if (!playing && audioRef.current) {
            Promise.all([(audioRef.current.src = props.AudioSRC)]).then(() => {
              audioRef.current?.play();
              toast({
                title: `Now Playing: ${props.name}`,
                description: 'Loading may take some time!',
              });
            });
          }
        }}
        className="bg-foreground text-primary-foreground p-3 rounded-full active:scale-90 transition-all duration-200"
      >
        {playing ? <Icons.Pause /> : <Icons.Play className="pl-1" />}
      </button>
      <audio id="spotifyAudio" ref={audioRef} className="hidden"></audio>
    </>
  );
}
