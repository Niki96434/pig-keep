import 'dotenv/config'
import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import path from 'node:path'

dotenv.config({ path: path.resolve(process.cwd(), './../../../.env.test') })

if (process.env.NODE_ENV !== 'test' || process.env.DATABASE_URL?.includes('test')) {
  throw new Error('Опасные операции с БД разрешены только при флаге NODE_ENV=test')
}

export const test_pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const test_db = drizzle({ client: test_pool })
