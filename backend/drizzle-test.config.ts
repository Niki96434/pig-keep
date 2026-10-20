import * as dotenv from 'dotenv'
dotenv.config({ path: '../.env.test' })
import path from 'node:path'
import { defineConfig } from 'drizzle-kit'

dotenv.config({ path: path.resolve(process.cwd(), '.env.test'), override: true })

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/core/db/schema.ts',
  out: './migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: 'migrations_table',
    schema: 'migrations_schema',
  },
})
