import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const messagesSchema = pgTable('messages', {
  id: serial('id').primaryKey(),
  message: text('message').notNull(),
  createdAt: text('createdAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  sender: text('sender').notNull(),
  senderMail: text('senderMail').notNull(),
  senderImage: text('senderImage').notNull(),
});

export type Messages = typeof messagesSchema.$inferSelect;
