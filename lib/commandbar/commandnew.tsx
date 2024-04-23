"use client";

import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Home, Book, MessageCircleHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { ActionCharacter } from "./getaction";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export function CommandDialogBox() {
  const [open, setOpen] = useState(false);
  const { status, data: session } = useSession();
  const router = useRouter();
  const Pages = [
    {
      name: "Home",
      icon: <Home className="mr-2 h-4 w-4" />,
      perform: () => {
        if (window.location.pathname === "/") {
          setOpen(false);
        } else {
          router.push("/");
        }
      },
    },
    {
      name: "Blogs",
      icon: <Book className="mr-2 h-4 w-4" />,
      perform: () => {
        router.push("/blogs");
      },
    },
    {
      name: "Chat",
      icon: <MessageCircleHeart className="mr-2 h-4 w-4" />,
      perform: () => {
        router.push("/chat");
      },
    },
    {
      name: "Events",
      icon: <CalendarIcon className="mr-2 h-4 w-4" />,
      perform: () => {
        router.push("/events");
      },
    },
    {
      name: "Projects",
      icon: <RocketIcon className="mr-2 h-4 w-4" />,
      perform: () => {
        router.push("/projects");
      },
    },
    {
      name: "Credits",
      icon: <FaceIcon className="mr-2 h-4 w-4" />,
      perform: () => {
        router.push("/credits");
      },
    },
  ];

  const Settings = [
    {
      name: status === "authenticated" ? "Sign Out" : "Sign In",
      icon:
        status === "authenticated" ? (
          <Image
            src={session.user?.image || ""}
            alt={session.user?.name || ""}
            width={20}
            className="rounded-full mr-2"
            height={16}
          />
        ) : (
          <PersonIcon className="mr-2 h-4 w-4" />
        ),
      perform: () => {
        if (status === "authenticated") {
          signOut();
        } else {
          signIn("google");
        }
      },
    },
    {
      name: "Mail",
      icon: <EnvelopeClosedIcon className="mr-2 h-4 w-4" />,
      perform: () => {
        window.open("mailto:redskull@duck.com");
      },
    },
    {
      name: "Settings",
      icon: <GearIcon className="mr-2 h-4 w-4" />,
      perform: () => {
        toast("⛑️ On it:", {
          description: "Settings Page is under development",
        });
      },
    },
  ];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        aria-label="Home Launcher"
        variant="default"
        className="gap-2 max-xl:gap-0"
      >
        <Home className="h-5 w-5" />
        <pre className="max-xl:hidden">
          <code>
            <ActionCharacter /> + K
          </code>
        </pre>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {/* <CommandGroup heading="Suggestions">
            <CommandItem>
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <FaceIcon className="mr-2 h-4 w-4" />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <RocketIcon className="mr-2 h-4 w-4" />
              <span>Launch</span>
            </CommandItem>
          </CommandGroup> */}
          <CommandSeparator />
          <CommandGroup heading="Pages">
            {Pages.map((page, index) => {
              return (
                <CommandItem key={index}>
                  <div
                    onClick={() => {
                      page.perform();
                      setOpen(false);
                    }}
                    className="flex w-full"
                  >
                    {page.icon}
                    <span>{page.name}</span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            {Settings.map((setting, index) => {
              return (
                <CommandItem key={index}>
                  <div
                    onClick={() => {
                      setting.perform();
                      setOpen(false);
                    }}
                    className="flex w-full"
                  >
                    {setting.icon}
                    <span>{setting.name}</span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
