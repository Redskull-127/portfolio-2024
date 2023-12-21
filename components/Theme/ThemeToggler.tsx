"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const { toast } = useToast();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-label="Toggle Theme"
            variant="default"
            size="icon"
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
              toast({
                title: "Theme Toggled!",
                description: `Theme set to ${
                  theme === "dark" ? "light" : "dark"
                }`,
              });
            }}
          >
            <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
            <Moon className="hidden h-5 w-5 dark:block" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Dark/Light Mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
