"use client";
import { Button } from "@/components/ui/button";
import { Cast } from "lucide-react";
import { useCastContext } from "../providers/CastProvider";
import CastSDK from "@/lib/cast-min";

export default function ChromeCast() {
  const { castDetails } = useCastContext();
  const cjs = new CastSDK();
  const Metadata = {
    poster: "",
    title: castDetails.title,
  };
  const handleClick = () => {
    console.log(castDetails.src);
    if (cjs) {
      cjs.cast(castDetails.src, Metadata);
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
