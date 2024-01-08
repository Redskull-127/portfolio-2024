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
  Home,
  CircleUser,
  LogOut,
  LogIn,
  Bell,
} from "lucide-react";
import { useCommandBarContext } from "@/lib/commandbar/commandbar";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { CommandDialogBox } from "@/lib/commandbar/commandnew";

export function Settings() {
  const { shouldShow, setShouldShow } = useCommandBarContext();
  const { status, data: session } = useSession();
  const notificationRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!window.localStorage.getItem("notificationSound")) {
      window.localStorage.setItem("notificationSound", "low");
    }
  }, []);

  return (
    <div className=" flex flex-col h-fit rounded-2xl bg-ternary-foreground p-6 w-full">
      <h1 className="text-3xl font-semibold text-ternary">Other</h1>
      <div className="grid grid-flow-col justify-start gap-3 py-2 max-xl:py-4 overflow-hidden w-full place-items-start max-xl:overflow-x-scroll ">
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
      </div>
    </div>
  );
}
