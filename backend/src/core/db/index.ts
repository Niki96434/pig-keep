import 'dotenv/config'
import dotenv from 'dotenv'
import path from 'path'
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

dotenv.config({ path: path.resolve(process.cwd(), './../../../.env') })

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
})

pool.on('error', (_err: Error) => {
  process.exit(1)
})

export const db = drizzle({ client: pool })
