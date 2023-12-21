"use client";

import Link from "next/link";

import { ThemeToggle } from "@/components/Theme/ThemeToggler";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Coffee, CircleDollarSign, Home } from "lucide-react";
import { useCommandBarContext } from "@/lib/commandbar/commandbar";

export function Support() {
  const { shouldShow, setShouldShow } = useCommandBarContext();
  return (
    <div className=" flex flex-col h-fit rounded-2xl  bg-ternary-foreground p-6">
      <h1 className="text-3xl font-semibold text-ternary">Other</h1>
      <div className="flex py-2 gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  setShouldShow(!shouldShow);
                }}
                aria-label="Home Launcher"
                variant="default"
                className="gap-2"
              >
                <Home className="h-5 w-5" />
                <pre className="sr-only:hidden">
                  <code>Ctrl + K</code>
                </pre>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Home Launcher</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ThemeToggle />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="https://www.buymeacoffee.com/meertarbani" target="_blank">
              <Button
                aria-label="buy me a coffee"
                variant="default"
                size={"icon"}
              >
                <Coffee className="h-5 w-5" />
              </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Buy me a coffee!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={"https://github.com/sponsors/Redskull-127?o=esc"} target="_blank">
              <Button
                aria-label="Support me on stripe"
                variant="default"
                size={"icon"}
              >
                <CircleDollarSign className="h-5 w-5" />
              </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Support Me!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
