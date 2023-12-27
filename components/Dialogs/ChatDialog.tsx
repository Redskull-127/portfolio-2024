"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useSession, signIn } from "next-auth/react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";
import styles from "@/lib/static/chat.module.css";
import Image from "next/image";
import { Button } from "../ui/button";
import { ChatForm } from "@/lib/server/functions/chatform";
import { useFormStatus } from "react-dom";
import { Icons } from "../icons";
import { RefreshCcw } from "lucide-react";

export type MessageType = {
  id?: number;
  message: string;
  sender: string;
  senderMail: string;
  senderImage: string;
};

export function ChatDialog(props: { messages: MessageType[] }) {
  const { data: session, status } = useSession();
  const ws = useRef<WebSocket>();
  const [data, setData] = useState(props.messages);
  const router = useRouter();
  const [shouldOpen] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>();
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const { pending } = useFormStatus();

  const handleScrollToBottom = () => {
    chatBoxRef.current?.scrollIntoView({ behavior: "smooth" });
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current?.scrollHeight);
  };

  const sendMessageSocket = async (message: MessageType) => {
    const stringify = JSON.stringify(message);
    ws.current?.send(stringify);
  };

  const handleNewMessage = async (event: any) => {
    const text = await new Response(event.data).text();
    const message = JSON.parse(text);
    setData((prev) => [...prev, message]);
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    ws.current = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_URL!);
    ws.current.onerror = (error) => console.error(error);

    ws.current.onmessage = (event) => {
      handleNewMessage(event);
    };

    const wsCurrent = ws.current;

    return () => wsCurrent.close();
  }, []);

  if (!isMounted) return null;
  if (status === "loading") return null;
  if (status === "unauthenticated")
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
            <DrawerTitle>
              Chat
              <Button
                className="ml-2 gap-2 absolute right-0 mr-2"
                size={"icon"}
              >
                <RefreshCcw className="h-5 w-5" />
              </Button>
            </DrawerTitle>
            <DrawerDescription>Chat with everyone!</DrawerDescription>
          </DrawerHeader>
          <div
            onLoad={() => handleScrollToBottom()}
            ref={chatBoxRef}
            className="flex flex-col p-2 max-h-96 gap-3 overflow-hidden max-w-full overflow-y-scroll "
          >
            {data.map((chat, key) => (
              <div
                key={key}
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
                <div className={cn(styles.messages)}>{chat.message}</div>
              </div>
            ))}
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
                placeholder="Type your message here."
                name="message-input"
                required
              />
              <Button disabled={pending} className="disabled:opacity-60">
                {pending ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white rounded-full"></div>
                ) : (
                  "Send"
                )}
              </Button>
            </form>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Suspense>
  );
}

export async function sendMessage(
  e: React.FormEvent<HTMLFormElement>,
  session: any,
  sendMessageSocket: (message: MessageType) => void
) {
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  await ChatForm(formData, {
    name: session?.user?.name!,
    email: session?.user?.email!,
    image: session?.user?.image!,
  });
  await sendMessageSocket({
    message: formData.get("message-input") as string,
    sender: session?.user?.name!,
    senderMail: session?.user?.email!,
    senderImage: session?.user?.image!,
  });
  form.reset();
}
