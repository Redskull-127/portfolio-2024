'use client';
import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { Button } from '../ui/button';
import clsx from 'clsx';

export default function IntroDialog() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(true);
  const [selectedCrumb, setSelectedCrumb] = useState<number>(0);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const crumbs = [
    {
      name: 'Getting Started',
    },
    {
      name: 'Technologies',
    },
    {
      name: 'Features',
    },
    {
      name: 'Source Code',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>👋 Welcome!</DialogTitle>
          <DialogDescription>
            Hey there, welcome to my portfolio! Let&apos;s get started...
          </DialogDescription>
        </DialogHeader>
        <Breadcrumb className="w-full ">
          <BreadcrumbList>
            {crumbs.map((crumb, index) => {
              return (
                <>
                  <BreadcrumbItem key={index}>
                    <BreadcrumbLink asChild>
                      <Button
                        variant="link"
                        className={clsx(
                          'p-0 text-secondary',
                          index === selectedCrumb && 'text-primary underline',
                        )}
                        onClick={() => {
                          setSelectedCrumb(index);
                        }}
                      >
                        {crumb.name}
                      </Button>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {index !== crumbs.length - 1 && <BreadcrumbSeparator />}
                </>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex justify-between items-center">
          <p>
            {selectedCrumb === 0
              ? `This is a simple portfolio built with Next.js and TailwindCSS.`
              : selectedCrumb === 1
                ? `I have used various technologies like React, TypeScript, and TailwindCSS.`
                : selectedCrumb === 2
                  ? `This portfolio showcases my projects, skills, and other information.`
                  : `You can view the source code of this portfolio on GitHub.`}
          </p>
          {selectedCrumb === 3 && (
            <Button
              variant={'link'}
              onClick={() => {
                window.open(
                  'https://github.com/redskull-127/Portfolio-2024',
                  '_blank',
                );
              }}
            >
              Check Out!
            </Button>
          )}
        </div>

        {/* next button */}
        <div className="flex gap-3 justify-end">
          <Button
            variant={'secondary'}
            onClick={() => {
              if (selectedCrumb === 0) return;
              setSelectedCrumb(selectedCrumb - 1);
            }}
          >
            Previous
          </Button>

          <Button
            onClick={() => {
              if (selectedCrumb === 3) return;
              setSelectedCrumb(selectedCrumb + 1);
            }}
          >
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
