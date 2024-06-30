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
import { Features, GettingStarted, SourceCode, Technologies } from './crumbs';

export default function IntroDialog() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(true);
  const [selectedCrumb, setSelectedCrumb] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const crumbs = [
    { name: 'Getting Started' },
    { name: 'Technologies' },
    { name: 'Features' },
    { name: 'Source Code' },
  ];

  const handleCrumbClick = (index: number) => setSelectedCrumb(index);

  const renderSelectedCrumbContent = () => {
    switch (selectedCrumb) {
      case 0:
        return <GettingStarted />;
      case 1:
        return <Technologies />;
      case 2:
        return <Features />;
      case 3:
        return (
          <>
            <SourceCode />
            <Button
              variant="link"
              onClick={() =>
                window.open(
                  'https://github.com/redskull-127/Portfolio-2024',
                  '_blank',
                )
              }
            >
              Check Out!
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  const handlePreviousClick = () => {
    if (selectedCrumb > 0) setSelectedCrumb(selectedCrumb - 1);
  };

  const handleNextClick = () => {
    if (selectedCrumb < crumbs.length - 1) setSelectedCrumb(selectedCrumb + 1);
    else handleOnFinish();
  };

  const handleOnFinish = () => {
    localStorage.setItem('intro-visited', 'true');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>👋 Welcome!</DialogTitle>
          <DialogDescription>
            Hey there, welcome to my portfolio! Let&apos;s get started...
          </DialogDescription>
        </DialogHeader>
        <Breadcrumb className="w-full">
          <BreadcrumbList>
            {crumbs.map((crumb, index) => (
              <BreadcrumbItem key={index}>
                <BreadcrumbLink asChild>
                  <Button
                    variant="link"
                    className={clsx(
                      'p-0 text-secondary',
                      index === selectedCrumb && 'text-primary underline',
                    )}
                    onClick={() => handleCrumbClick(index)}
                  >
                    {crumb.name}
                  </Button>
                </BreadcrumbLink>
                {index !== crumbs.length - 1 && <BreadcrumbSeparator />}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex justify-between items-center">
          {renderSelectedCrumbContent()}
        </div>
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            disabled={selectedCrumb === 0}
            className="select-none"
            onClick={handlePreviousClick}
          >
            Previous
          </Button>
          <Button
            className={clsx(
              'select-none',
              selectedCrumb === crumbs.length - 1 &&
                'bg-[#248f68] hover:bg-ternary text-white',
            )}
            onClick={handleNextClick}
          >
            {selectedCrumb === crumbs.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
