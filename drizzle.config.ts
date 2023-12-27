import type { Config } from "drizzle-kit";
import { readFileSync } from "fs";
import postgres from "postgres";

export const pgConfig = postgres({
  user: process.env.DRIZZLE_USER!,
  database: process.env.DRIZZLE_DB!,
  password: process.env.DRIZZLE_PASSWORD!,
  port: Number(process.env.DRIZZLE_PORT!),
  ssl: {
    ca: [readFileSync("./db/ca.pem").toString()]
  }
})

export default {
  schema: "./db/schema.ts",
  out: "./drizzle/migrations",
  driver: "pg",
  dbCredentials: {
    host: process.env.DRIZZLE_HOST!,
    connectionString: `${process.env.DATABASE_URL}?sslmode=no-verify`,
  }
} satisfies Config;