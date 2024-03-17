"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icons } from "../icons/icons";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { ChatAPIMaker } from "@/lib/server/functions/chatapi";

const TestData = [
  {
    message:
      "Hey there! You can ask me anything about Meer Tarbani. For example: Who is Meer Tarbani?, Skills, Projects, LinkedIn, Mail, etc.",
    sender: "bot",
  },
];

export default function ChatAI() {
  const submitRef = useRef<HTMLButtonElement>(null);
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState(TestData);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView();
    }, 500);
    if (shouldScroll && bottomRef.current) {
      timer;
    }
    return () => clearTimeout(timer);
  }, [shouldScroll, messages]);

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="left-0 cursor-pointer hover:text-muted-foreground transition-all duration-200 right-0 top-[2%] max-md:top-[90%] fixed mx-auto flex h-fit w-fit items-center justify-center">
          <div className="h-12 w-full  rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1">
            <div className="flex h-full w-full rounded-xl items-center justify-center bg-primary-foreground back">
              <h1 className="text-md px-4 select-none font-medium">
                Chat with AI!
              </h1>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat with AI</DialogTitle>
          <DialogDescription>
            This is a chatbot that uses Google&apos;s Gemini AI to chat with
            you.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea
          onLoad={() => {
            setShouldScroll(true);
          }}
          className="flex flex-col min-h-[30vh] max-h-[50vh] w-full "
        >
          {messages.map((data, index) => {
            return (
              <div
                key={index}
                className={
                  data.sender === "bot"
                    ? `flex h-fit w-full justify-start items-start gap-3`
                    : `flex h-fit w-full float-end justify-end items-start gap-3 my-3`
                }
              >
                {data.sender === "bot" && (
                  <Icons.Bot className="h-5 max-w-5 my-3" />
                )}
                <h1 className="text-md p-3 border rounded-md max-w-96">
                  {data.message}
                </h1>
                {data.sender === "user" && (
                  <Icons.User className="h-5 w-5 my-3" />
                )}
              </div>
            );
          })}
          <div
            onLoad={(e) => {
              e.currentTarget.scrollIntoView({ behavior: "smooth" });
            }}
            ref={bottomRef}
          ></div>
        </ScrollArea>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setPending(true);
            const request = await ChatAPIMaker(input);

            if (request.status === "error") {
              setMessages([
                ...messages,
                { message: input, sender: "user" },
                {
                  message: "Something went wrong, Please try again.",
                  sender: "bot",
                },
              ]);
              setInput("");
              setPending(false);
              return;
            }

            if (request.status === "success" && request.data?.message) {
              setMessages([
                ...messages,
                { message: input, sender: "user" },
                { message: request.data?.message, sender: "bot" },
              ]);
              setInput("");
              setPending(false);
              return;
            }

            setMessages([
              ...messages,
              { message: input, sender: "user" },
              { message: "I am a bot", sender: "bot" },
            ]);
            setInput("");
            setPending(false);
          }}
          className="w-full flex items-center gap-2"
        >
          <Textarea
            rows={1}
            cols={1}
            placeholder="Type your message here."
            name="message-input"
            required
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            ref={submitRef}
            disabled={pending}
            className="disabled:opacity-60"
          >
            {pending ? (
              <div className="animate-spin w-5 h-5 border-2 border-gray-700 rounded-full"></div>
            ) : (
              "Send"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
