import 'dotenv/config'
import * as dotenv from 'dotenv'
dotenv.config({ path: '../.env' })
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
})

pool.on('error', (_err: Error) => {
  process.exit(1)
})

export const db = drizzle({ client: pool })
