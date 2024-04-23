"use client";
import { Icons } from "@/components/icons/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function LyricsButton({
  song,
  name,
  lyrics,
}: {
  song: string;
  name: string;
  lyrics: string;
}) {
  return (
    <Dialog>
      <DialogTrigger title="Lyrics" asChild>
        <Icons.WholeWord className="flex text-2xl font-semibold text-ternary select-none cursor-pointer transition-all duration-200 hover:text-foreground" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lyrics</DialogTitle>
          <DialogDescription>
            {song} - {name}
            <div className="pt-8">
              {lyrics && lyrics !== "" ? (
                <ScrollArea className="h-96">
                  <p
                    className="text-ternary text-lg whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: lyrics }}
                  />
                </ScrollArea>
              ) : (
                <p>No lyrics found. :(</p>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
