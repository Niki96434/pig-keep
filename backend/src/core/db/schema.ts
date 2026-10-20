import { boolean, index, pgTable, primaryKey, text, uuid, timestamp } from 'drizzle-orm/pg-core'
import { defineRelations, sql } from 'drizzle-orm'

export const notesTable = pgTable(
  'notes',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    title: text().default('').notNull(),
    content: text().default('').notNull(),
    isArchive: boolean().default(false).notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (table) => [
    index('search_index').using(
      'gin',
      sql`to_tsvector('russian', coalesce(${table.title}, '') || ' ' || coalesce(${table.content}))`
    ),
  ]
)

export const tagsTable = pgTable('tags', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text().notNull().unique(),
})

export const noteTagsTable = pgTable(
  'note_tags',
  {
    note_id: uuid('note_id')
      .notNull()
      .references(() => notesTable.id, { onDelete: 'cascade' }),
    tag_id: uuid('tag_id')
      .notNull()
      .references(() => tagsTable.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.tag_id, table.note_id] }),
    index('idx_note_tags').on(table.note_id),
  ]
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
