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

import BlogJSON from '@/lib/static/blogs.json';
import { Button } from '../ui/button';

export default function BlogDialog() {
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
          <DialogTitle>Blogs</DialogTitle>
          <DialogDescription className="py-2">
            I write some nerdy stuff...
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-80 w-full">
          <Accordion type="single" collapsible>
            {BlogJSON.map((blog, index) => (
              <AccordionItem key={index} value={blog.title}>
                <AccordionTrigger>{blog.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex justify-between items-center">
                    <p>{blog.description}</p>
                    <Button
                      variant={'link'}
                      onClick={() => {
                        window.open(blog.link, '_blank');
                      }}
                    >
                      Read
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
