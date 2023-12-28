"use client";

import Link from "next/link";
import Image from "next/image";

import { ThemeToggle } from "@/components/Theme/ThemeToggler";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import {
  Coffee,
  CircleDollarSign,
  Home,
  CircleUser,
  LogOut,
  LogIn,
} from "lucide-react";
import { useCommandBarContext } from "@/lib/commandbar/commandbar";
import { signIn, signOut, useSession } from "next-auth/react";

export function Support() {
  const { shouldShow, setShouldShow } = useCommandBarContext();
  const { status, data: session } = useSession();
  return (
    <div className=" flex flex-col h-fit rounded-2xl bg-ternary-foreground p-6 w-full">
      <h1 className="text-3xl font-semibold text-ternary">Other</h1>
      <div className="grid grid-flow-col justify-start gap-3 py-2 max-md:py-4 overflow-hidden w-full place-items-start max-md:overflow-x-scroll ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  setShouldShow(!shouldShow);
                }}
                aria-label="Home Launcher"
                variant="default"
                className="gap-2 max-md:gap-0"
              >
                <Home className="h-5 w-5" />
                <pre className="max-md:hidden">
                  <code>Ctrl + K</code>
                </pre>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Home Launcher</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="user action center"
              variant={status === "authenticated" ? "ghost" : "default"}
              size={"icon"}
            >
              {status === "authenticated" ? (
                <Image
                  src={session.user?.image!}
                  width={40}
                  height={40}
                  className="rounded-sm"
                  alt="user"
                />
              ) : (
                <CircleUser className="h-5 w-5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              {status === "authenticated"
                ? session.user?.name
                : "Action Required"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {status === "authenticated" ? (
              <DropdownMenuItem
                onClick={() => {
                  signOut();
                }}
              >
                <LogOut className="h-5 w-5 mr-2" /> Sign Out
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => {
                  signIn("google");
                }}
              >
                <LogIn className="h-5 w-5 mr-2" /> Log in
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="https://www.buymeacoffee.com/meertarbani"
                target="_blank"
              >
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
              <Link
                href={"https://github.com/sponsors/Redskull-127?o=esc"}
                target="_blank"
              >
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
