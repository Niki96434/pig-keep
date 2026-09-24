import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const notesTable = pgTable('notes', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  user_id: uuid()
    .default(sql`gen_random_uuid()`)
    .notNull(),
  title: text().default('').notNull(),
  content: text().default('').notNull(),
})
