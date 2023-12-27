"use server";

import { getMessages } from "@/lib/server/functions/chatform";
import { ChatDialog } from "./ChatDialog";

export default async function ChatHandler() {
  const allMessages = await getMessages();
  return <ChatDialog messages={allMessages} />;
}
