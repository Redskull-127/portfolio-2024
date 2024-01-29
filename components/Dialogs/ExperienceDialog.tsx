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

import ExperienceJSON from "@/lib/static/experience.json";

export default function ExperienceDialog() {
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
          <DialogTitle>Experiences</DialogTitle>
          <DialogDescription className="py-2">
            Here are some of my experiences in the field of Computer
            Science/Tech.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-80 w-full">
          <Accordion type="single" collapsible>
            {ExperienceJSON.map((event, index) => (
              <AccordionItem key={index} value={event.title}>
                <AccordionTrigger>
                  <div className="flex w-full justify-between">
                    <p>{event.title}</p>
                    <p>{event.date}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col items-start">
                    <p>{event.description}</p>
                    <div className="flex items-start flex-wrap gap-x-2">
                      Skills
                      {event.skills.map((skill, index) => (
                        <p
                          key={index}
                          className="text-sm font-semibold text-ternary"
                        >
                          {skill}
                          {index !== event.skills.length - 1 && ","}
                        </p>
                      ))}
                    </div>
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
