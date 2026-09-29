import { boolean, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core'
import { defineRelations, sql } from 'drizzle-orm'

export const notesTable = pgTable('notes', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  user_id: uuid()
    .default(sql`gen_random_uuid()`)
    .notNull(),
  title: text().default('').notNull(),
  content: text().default('').notNull(),
  isArchive: boolean().default(false),
  isDeleted: boolean().default(false),
})

export const tagsTable = pgTable('tags', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text().notNull(),
})

export const noteTagsTable = pgTable(
  'noteTags',
  {
    note_id: uuid('note_id')
      .notNull()
      .references(() => notesTable.id),
    tag_id: uuid('tag_id')
      .notNull()
      .references(() => tagsTable.id),
  },
  (table) => [primaryKey({ columns: [table.tag_id, table.note_id] })]
)

export const noteTagsRelations = defineRelations({ tagsTable, notesTable, noteTagsTable }, (r) => ({
  tagsTable: {
    notesTable: r.many.notesTable({
      from: r.tagsTable.id.through(r.noteTagsTable.tag_id),
      to: r.notesTable.id.through(r.noteTagsTable.note_id),
    }),
  },
  notesTable: {
    tagsTable: r.many.tagsTable({
      from: r.notesTable.id.through(r.noteTagsTable.note_id),
      to: r.tagsTable.id.through(r.noteTagsTable.tag_id),
    }),
  },
}))
