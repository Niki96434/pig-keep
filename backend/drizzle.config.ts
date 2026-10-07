import * as dotenv from 'dotenv'
dotenv.config({ path: '../.env' })
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './migrations',
  schema: './src/core/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: 'migrations_table',
    schema: 'migrations_schema',
  },
})
