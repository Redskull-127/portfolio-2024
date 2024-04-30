"use client";
import { useRef, useEffect } from "react";

export default function MarqueeText({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const spotifyCard = document.getElementById("spotify-card");
    if (
      spotifyCard &&
      container &&
      container.scrollWidth > spotifyCard.clientWidth
    ) {
      container.classList.add("animate-marquee-text");
    } else {
      container?.classList.remove("animate-marquee-text");
    }
    return () => {
      container?.classList.remove("animate-marquee-text");
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="inline-block text-lg font-semibold text-center"
    >
      {text}
    </div>
  );
}
