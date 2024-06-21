"use client";
import { useEffect, useState } from "react";
import WebSocket from "isomorphic-ws";

const SOCKET_URL = process.env.NEXT_PUBLIC_LIVEUSER!;
export default function LiveCount() {
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    const ws = new WebSocket(SOCKET_URL);
    ws.onmessage = (event: WebSocket) => {
      const data = JSON.parse(event.data);
      setActiveUsers(data.activeUsers);
    };


    return () => {
      ws.close();
    };
  }, []);
  if (!activeUsers) return null;
  if (activeUsers === 0) return null;
  return (
    <button
      id="chat-with-ai"
      className="relative inline-flex overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-white dark:bg-primary-foreground px-3 py-1 text-sm font-medium dark:text-white text-primary backdrop-blur-3xl">
        {activeUsers} Live {activeUsers === 1 ? "User" : "Users"}
      </span>
    </button>
  );
}
