import type { Config } from 'drizzle-kit';

export default {
  schema: './dbs/schema.ts',
  out: './drizzle.ts',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config;
