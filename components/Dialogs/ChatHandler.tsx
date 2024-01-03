"use server";

import { getMessages } from "@/lib/server/functions/chatform";
import { ChatDialog } from "./ChatDialog";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";

export default async function ChatHandler() {
  const allMessages = await getMessages();
  return (
    <Suspense
      fallback={<Skeleton className="w-[100px] h-[20px] rounded-full" />}
    >
      <ChatDialog messages={allMessages} />
    </Suspense>
  );
}
