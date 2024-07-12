'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';

import { siteConfig } from '@/site-config';
import { Button } from '../ui/button';

export default function EventsDialog() {
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
          router.replace('/');
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Events</DialogTitle>
          <DialogDescription className="py-2">
            Some of the events/hackathon&apos;s I have organized...
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-80 w-full">
          <Accordion type="single" collapsible>
            {siteConfig.components.events.map((event, index) => (
              <AccordionItem key={index} value={event.title}>
                <AccordionTrigger>{event.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex justify-between items-center">
                    <p>{event.description}</p>
                    <Button
                      variant={'link'}
                      onClick={() => {
                        window.open(event.link, '_blank');
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
