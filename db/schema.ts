import { sql } from 'drizzle-orm';
import { pgTable, serial, text, varchar, jsonb } from 'drizzle-orm/pg-core';

export const messagesSchema = pgTable('messages', {
  id: serial('id').primaryKey(),
  message: text('message').notNull(),
  createdAt: text('createdAt').default(sql`CURRENT_TIMESTAMP`).notNull(),
  sender: text('sender').notNull(),
  senderMail: text('senderMail').notNull(),
  senderImage: text('senderImage').notNull(),
});
export type Messages = typeof messagesSchema.$inferSelect;

export const usersSchema = pgTable('users', {
  id: serial('id').primaryKey(),
  uuid: text('uuid').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  image: text('image').notNull(),
});
export type Users = typeof usersSchema.$inferSelect;

export const jobSchema = pgTable('jobs', {
  uuid: text('uuid').notNull().unique(),
  id: serial('id').primaryKey(),
  columnId: text('columnId').default('open'),
  userEmail: text('user_email').references(() => usersSchema.email),
  title: varchar('title', {
    length: 255,
  }).notNull(),
  company: text('company').notNull(),
  companyURL: text('companyURL'),
  jobType: text('jobType').notNull(),
  description: text('description').notNull(),
  location: text('location').notNull(),
  salary: text('salary'),
  applyLink: text('applyLink').notNull(),
  date: text('date').notNull(),
  contactInfo: jsonb('contactInfo')
    .$type<
      | {
          email: string;
          name: string;
          link: string;
        }[]
      | null
      | undefined
    >()
    .unique(),
});
export type Job = typeof jobSchema.$inferSelect;
