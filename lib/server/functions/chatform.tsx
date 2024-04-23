"use server";
import { db } from "@/db";
import { messagesSchema } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type userDataType = {
  name: string;
  email: string;
  image: string;
};

export async function ChatForm(formData: FormData, userData: userDataType) {
  const messageText = formData.get("message-input");
  await db.insert(messagesSchema).values({
    message: `${messageText}`,
    sender: `${userData.name}`,
    senderMail: `${userData.email}`,
    senderImage: `${userData.image}`,
  });
}

export async function getMessages() {
  const messages = await db.query.messagesSchema.findMany({
    orderBy: [asc(messagesSchema.id)],
  });
  return messages;
}

export async function deleteMessage(id: number) {
  try{
    await db.delete(messagesSchema).where(eq(messagesSchema.id, id));
  } catch (error) {
    console.error(error);
  }
}
