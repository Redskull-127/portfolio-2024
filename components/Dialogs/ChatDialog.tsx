"use client"
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import styles from "@/lib/static/chat.module.css";
import Image from "next/image";
import { Button } from "../ui/button";
import { ChatForm } from "@/lib/server/functions/chatform";
import { useFormStatus } from "react-dom";
import { Icons } from "../icons/icons";
import { convertDateFormat } from "@/lib/date-convertor";
import { useSocket } from "@/lib/client/providers/Socket";

export type MessageType = {
  id?: number;
  message: string;
  sender: string;
  senderMail: string;
  senderImage: string;
  createdAt?: string;
};

export function ChatDialog({ messages }: { messages: MessageType[] }) {
  const socket = useSocket();
  const { data: session, status } = useSession();
  const { pending } = useFormStatus();
  const submitRef = useRef<HTMLButtonElement>(null);
  const notifyRef = useRef<HTMLAudioElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState(messages);
  const [shouldOpen] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>();
  const router = useRouter();
  const [shouldScroll, setShouldScroll] = useState<boolean>(false);

  const sendMessageSocket = async (message: MessageType, e: HTMLFormElement) => {
    const stringify = message;
    socket.emit("send:message", stringify);
    const formData = new FormData(e);
    await ChatForm(formData, {
      name: session?.user?.name!,
      email: session?.user?.email!,
      image: session?.user?.image!,
    });
  };

  const handleNewMessage = useCallback(async (event: any) => {
    const message = event;
    setData((prev) => [...prev, message]);
    if (message.senderMail !== session?.user?.email) {
      notifyRef.current?.play();
    }
  }, [session?.user?.email]);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    socket.on("receive:message", handleNewMessage);
    return () => {
      socket.off("receive:message", handleNewMessage);
    };
  }, [socket, handleNewMessage]);

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        return submitRef.current?.click();
      }
    };
    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, []);

  useEffect(() => {
    if (shouldScroll && chatBoxRef.current) {
      chatBoxRef.current.scrollIntoView();
    }
  }, [shouldScroll, data]);

  useEffect(() => {
    if (window.localStorage.getItem("notificationSound")) {
      if (notifyRef.current) {
        const notificationSound = window.localStorage.getItem("notificationSound");
        if (notificationSound === "low") {
          notifyRef.current.volume = 0.1;
        } else {
          notifyRef.current.volume = 1;
        }
      }
    } else {
      window.localStorage.setItem("notificationSound", "low");
    }
  }, []);

  if (!isMounted || status === "loading") return null;

  if (status === "unauthenticated") {
    return (
      <Drawer
        shouldScaleBackground={true}
        open={shouldOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            router.push("/");
          }
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Login</DrawerTitle>
            <DrawerDescription>
              You need to login with your Google Account!
            </DrawerDescription>
          </DrawerHeader>
          <div className="w-full h-72 flex flex-col gap-3 justify-center items-center">
            <h1 className="text-2xl font-semibold">Sign in @meertarbani.in</h1>
            <Button className="ml-2 gap-2" onClick={() => signIn("google")}>
              <Icons.google className="h-5 w-5" /> Continue with Google
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Drawer
        shouldScaleBackground={true}
        open={shouldOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            router.push("/");
          }
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-center text-2xl">Chat</DrawerTitle>
            <DrawerDescription className="text-center">
              Chat with everyone!
            </DrawerDescription>
          </DrawerHeader>
          <div
            onLoad={() => {
              setShouldScroll(true);
            }}
            className="w-full flex flex-col p-2 max-h-96 gap-3 overflow-hidden max-w-full overflow-y-scroll "
          >
            {data.map((chat, key) => (
              <div
                key={chat.id}
                className={cn(
                  chat.senderMail === session?.user?.email
                    ? styles.messages_container_user
                    : styles.messages_container
                )}
              >
                <Image
                  src={chat.senderImage}
                  className="rounded-full"
                  alt=""
                  width={36}
                  height={36}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn(styles.messages)}>{chat.message}</div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="gap-2 flex flex-row justify-center items-center">
                        <Image
                          src={chat.senderImage}
                          className="rounded-full"
                          alt=""
                          width={36}
                          height={36}
                        />
                        <p>
                          <span className="font-semibold">{chat.sender}</span>
                          <br />
                          <span className="font-light">
                            {convertDateFormat(chat.createdAt!)}
                          </span>
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
            <div ref={chatBoxRef}></div>
          </div>
          <DrawerFooter>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await sendMessage(e, session, sendMessageSocket);
              }}
              className="w-full flex gap-3 justify-center items-center"
            >
              <Textarea
                rows={1}
                cols={1}
                placeholder="Type your message here."
                name="message-input"
                required
              />
              <Button
                ref={submitRef}
                disabled={pending}
                className="disabled:opacity-60"
              >
                {pending ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white rounded-full"></div>
                ) : (
                  "Send"
                )}
              </Button>
            </form>
          </DrawerFooter>
          <audio className="hidden" src="/static/audio/notify.mp3" ref={notifyRef}></audio>
        </DrawerContent>
      </Drawer>
    </Suspense>
  );
}

export async function sendMessage(
  e: React.FormEvent<HTMLFormElement>,
  session: any,
  sendMessageSocket: (message: MessageType, e: HTMLFormElement) => void
) {
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  try {
    sendMessageSocket(
      {
        message: formData.get("message-input") as string,
        sender: session?.user?.name!,
        senderMail: session?.user?.email!,
        senderImage: session?.user?.image!,
      },
      form
    );
  } catch (error) {
    console.error(error);
  } finally {
    form.reset();
  }
}
