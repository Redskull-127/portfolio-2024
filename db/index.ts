import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const db = drizzle(
  postgres(process.env['DATABASE_URL']!, {
    ssl: 'require',
  }),
  {
    schema,
    logger: process.env['NODE_ENV'] === 'development' ? true : false,
  },
);
export default db;
