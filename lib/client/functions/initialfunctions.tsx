"use client";
import { useEffect } from "react";
// @ts-ignore
import { toast } from "sonner";

export function SpotifyTip() {
  useEffect(() => {
    toast("❔ Did you know?", {
      description: (
        <div className="inline-flex">
          Press{" "}
          <pre>
            <code> CTRL + K </code>
          </pre>{" "}
          to open the command bar!
        </div>
      ),
    });
  }, []);
  return null;
}
