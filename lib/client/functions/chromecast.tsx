"use client";
import { Button } from "@/components/ui/button";
import { Cast } from "lucide-react";
import { useCastContext } from "../providers/CastProvider";
import Castjs from "@/lib/cast-min.js";

export default function ChromeCast() {
  const { castDetails } = useCastContext();
  const Metadata = {
    poster: "",
    title: castDetails.title,
  };
  const handleClick = () => {
    if (typeof window !== undefined) {
      const cjs = new Castjs();
      console.log(castDetails.src);
      if (cjs) {
        cjs.cast(castDetails.src, Metadata);
      }
    }
  };
  return (
    <Button
      onClick={async (e) => {
        try {
          handleClick();
        } catch (error) {
          console.error(error);
        }
      }}
      variant={"default"}
      size={"icon"}
    >
      <Cast className="h-5 w-5" />
    </Button>
  );
}
