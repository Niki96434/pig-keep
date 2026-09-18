import dotenv from 'dotenv'
import path from 'node:path'
import { defineConfig } from 'drizzle-kit'

dotenv.config({ path: path.resolve(process.cwd(), '.env.test'), override: true })

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/features/**/schema.ts',
  out: './migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: 'migrations-table',
    schema: 'migrations-schema',
  },
})
