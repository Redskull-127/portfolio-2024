"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

import CreditsJSON from "@/lib/static/credits.json";
import { Button } from "../ui/button";

export default function CreditsDialog() {
  const router = useRouter();
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Dialog
      open={true}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          router.replace("/");
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Credits</DialogTitle>
          <DialogDescription className="py-2">
            Thank&apos;s to all the people/services who/which helped me in making this website.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-80 w-full">
          <Accordion type="single" collapsible>
            {CreditsJSON.map((event, index) => (
              <AccordionItem key={index} value={event.title}>
                <AccordionTrigger>{event.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex justify-between items-center">
                    <p>{event.description}</p>
                    <Button
                      variant={"link"}
                      onClick={() => {
                        window.open(event.link, "_blank");
                      }}
                    >
                      Check Out!
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
