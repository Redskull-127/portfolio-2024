"use client";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export function SpotifyTip() {
  const { toast } = useToast();
  useEffect(() => {
    toast({
      title: "❔ Did you know?",
      description: (
        <p className="inline-flex">
            Press <pre><code> CTRL + K </code></pre> to open the command bar! 
        </p>
      ),
    });
  }, [toast]);
  return null;
}
