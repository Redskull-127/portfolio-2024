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

import {
  Coffee,
  CircleDollarSign,
  CircleUser,
  LogOut,
  LogIn,
  Bell,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { CommandDialogBox } from "@/lib/commandbar/commandnew";
import ChromeCast from "./chromecast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import LiveCount from "@/components/live-count";
import { Icons } from "@/components/icons/icons";
import NumFormate from "@/lib/number-formate";

export type SettingsProps = {
  totalViews: number;
};

export function Settings(params: SettingsProps) {
  const { status, data: session } = useSession();
  const notificationRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!window.localStorage.getItem("notificationSound")) {
      window.localStorage.setItem("notificationSound", "low");
    }
  }, []);

  return (
    <div
      id="settings"
      className="flex flex-col rounded-2xl bg-ternary-foreground p-6 gap-3 w-full"
    >
      <div className="font-semibold text-ternary flex items-center justify-between max-md:flex-col max-md:items-start">
        <h1 className="text-3xl">Controls</h1>
        <div className="flex items-center gap-3 max-md:items-between max-md:text-sm max-md:mt-3">
          {params.totalViews && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex gap-1 hover:text-primary cursor-pointer transition-all">
                    <Icons.TrendingUp />
                    {NumFormate(params.totalViews)} Unique Visitors
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {NumFormate(params.totalViews)} Unique Visitors in past 30
                    Days!
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}{" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex gap-1 hover:text-primary cursor-pointer transition-all">
                  <Icons.Radio />
                  <LiveCount />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Active users in past 1 minute!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max py-1 space-x-3">
          <CommandDialogBox />
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

          <Button
            aria-label="notification center"
            variant={"default"}
            size={"icon"}
            ref={notificationRef}
            onClick={(e) => {
              const ref = notificationRef.current;
              const bell = ref?.firstChild as HTMLElement;
              bell.classList.toggle("scale-125");
              if (bell.classList.contains("scale-125")) {
                window.localStorage.setItem("notificationSound", "high");
              } else {
                window.localStorage.setItem("notificationSound", "low");
              }
              toast("Notification Sound Changed:", {
                description: bell.classList.contains("scale-125")
                  ? "High"
                  : "Low",
              });
            }}
          >
            <Bell className="h-5 w-5" />
          </Button>

          <ChromeCast />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
