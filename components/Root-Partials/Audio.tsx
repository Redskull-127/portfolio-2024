"use client";
import { useRef, useState, useEffect } from "react";
import { Icons } from "../icons";

type AudioButtonType = {
  AudioSRC: string;
};

export default function AudioButton(props: AudioButtonType) {
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
      PauseEvent();
    }

    ref?.addEventListener("ended", EndedEvent);
    return () => {
      ref?.removeEventListener("ended", EndedEvent);
    };
  }, [playing]);

  return (
    <>
      <button
        onClick={() => {
          setPlaying(!playing);
          if (!playing && audioRef.current) {
            audioRef.current.src = props.AudioSRC;
            audioRef.current?.play();
          }
          
        }}
        className="bg-foreground text-primary-foreground p-3 rounded-full active:scale-90 transition-all duration-200"
      >
        {playing ? <Icons.Pause /> : <Icons.Play className="pl-1"  />}
      </button>
      <audio ref={audioRef} className="hidden"></audio>
    </>
  );
}
