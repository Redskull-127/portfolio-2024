'use client';
import React from 'react';
import { ChartPie } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Dock, DockIcon } from '@/components/magicui/dock';
import { useMutationJobs } from '../hooks/useJobs';
import AddCard from '../add-card';

export type IconProps = React.HTMLAttributes<SVGElement>;

export function DockDemo() {
  const { mutate: mutateAddJobs } = useMutationJobs();
  return (
    <div className="absolute z-[50] flex ms-auto me-auto left-0 right-0 w-fit top-0 flex-col items-center justify-center overflow-hidden rounded-lg md:shadow-xl">
      <TooltipProvider>
        <Dock magnification={45}>
          <h1 className="h-full flex items-center justify-center font-semibold px-2 text-xl select-none cursor-default">
            Job Board
          </h1>
          <Separator orientation="vertical" className="h-full" />
          <DockIcon>
            <Tooltip>
              <TooltipTrigger
                asChild
                className="p-2 hover:bg-ternary-foreground hover:transition-colors rounded-xl"
              >
                <AddCard mutate={mutateAddJobs} title="Add Job" />
              </TooltipTrigger>
              <TooltipContent>
                <span>Add new job</span>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
          <DockIcon>
            <Tooltip>
              <TooltipTrigger
                asChild
                className="p-2 hover:bg-ternary-foreground hover:transition-colors rounded-xl"
              >
                <ChartPie className="size-10" />
              </TooltipTrigger>
              <TooltipContent>
                <span>View Statistics</span>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        </Dock>
      </TooltipProvider>
    </div>
  );
}
