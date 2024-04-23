import * as schema from "./schema";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db: PostgresJsDatabase<typeof schema> | undefined;
}

let db: PostgresJsDatabase<typeof schema>;

try {
  if (process.env.NODE_ENV === "production") {
    db = drizzle(
      postgres(`${process.env.DATABASE_URL}?sslmode=require`, {
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      {
        schema,
      },
    );
  } else {
    if (!global.db) {
      global.db = drizzle(
        postgres(`${process.env.DATABASE_URL}?sslmode=require`, {
          ssl: {
            rejectUnauthorized: false,
          },
        }),
        { schema },
      );
    }
    db = global.db;
  }
} catch (e) {
  console.log(e);
}

export { db };
