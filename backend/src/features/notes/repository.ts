import type { NoteCreateIn, NotePatchIn, NotePutIn } from '@app/shared/notes/types'
import { db } from '../../core/db/'
import { notesTable, noteTagsTable, tagsTable } from '../../core/db/schema'
import { and, eq, sql } from 'drizzle-orm'

interface DBType {
  db: typeof db
}

export interface GetNotesParams {
  search?: string | undefined
  tagId?: string | undefined
}

export function repository({ db }: DBType) {
  const getNotesFromDB = async (params?: GetNotesParams) => {
    const { search, tagId } = params || {}
    const conditions = []

    if (search) {
      conditions.push(
        sql`to_tsvector('russian', coalesce(${notesTable.title}, '') || ' ' || coalesce(${notesTable.content}, '')) @@ websearch_to_tsquery('russian', ${search})`
      )
    }

    if (tagId) {
      conditions.push(eq(noteTagsTable.tag_id, tagId))

      const query = db
        .select({
          id: notesTable.id,
          user_id: notesTable.user_id,
          title: notesTable.title,
          content: notesTable.content,
          isArchive: notesTable.isArchive,
          isDeleted: notesTable.isDeleted,
        })
        .from(notesTable)
        .innerJoin(noteTagsTable, eq(notesTable.id, noteTagsTable.note_id))
        .where(conditions.length > 1 ? and(...conditions) : conditions[0])

      if (search) {
        return await query.limit(10)
      }
      return await query
    }

    if (conditions.length > 0) {
      return await db
        .select()
        .from(notesTable)
        .where(conditions[0])
        .limit(10)
    }

    return await db.select().from(notesTable)
  }

  const getNoteByIdFromDB = async (noteId: string) => {
    const [note] = await db.select().from(notesTable).where(eq(notesTable.id, noteId))
    return note
  }

  const createNoteFromDB = async (noteData: NoteCreateIn) => {
    const [note] = await db
      .insert(notesTable)
      .values({ ...noteData })
      .returning()
    return note
  }

  const putNoteFromDB = async (noteId: string, noteData: NotePutIn) => {
    if (Object.keys(noteData).length === 0) {
      const [note] = await db.select().from(notesTable).where(eq(notesTable.id, noteId))
      return note
    }
    const [note] = await db
      .update(notesTable)
      .set({ ...noteData })
      .where(eq(notesTable.id, noteId))
      .returning()

    return note
  }

  const patchNoteFromDB = async (noteId: string, noteData: NotePutIn | NotePatchIn) => {
    if (Object.keys(noteData).length === 0) {
      const [note] = await db.select().from(notesTable).where(eq(notesTable.id, noteId))
      return note
    }
    const [note] = await db
      .update(notesTable)
      .set({ ...noteData })
      .where(eq(notesTable.id, noteId))
      .returning()

    return note
  }

  const deleteNoteFromDB = async (noteId: string) => {
    const result = await db.delete(notesTable).where(eq(notesTable.id, noteId))
    return result.rowCount
  }

  const getNoteTagsFromDB = async (noteId: string) => {
    return await db
      .select({ id: tagsTable.id, name: tagsTable.name })
      .from(tagsTable)
      .innerJoin(noteTagsTable, eq(tagsTable.id, noteTagsTable.tag_id))
      .where(eq(noteTagsTable.note_id, noteId))
  }

  const addTagToNoteInDB = async (noteId: string, tagId: string) => {
    return await db
      .insert(noteTagsTable)
      .values({ note_id: noteId, tag_id: tagId })
      .onConflictDoNothing()
      .returning()
  }

  const removeTagFromNoteInDB = async (noteId: string, tagId: string) => {
    const result = await db
      .delete(noteTagsTable)
      .where(and(eq(noteTagsTable.note_id, noteId), eq(noteTagsTable.tag_id, tagId)))
    return result.rowCount
  }

  return {
    getNotesFromDB,
    getNoteByIdFromDB,
    createNoteFromDB,
    putNoteFromDB,
    patchNoteFromDB,
    deleteNoteFromDB,
    getNoteTagsFromDB,
    addTagToNoteInDB,
    removeTagFromNoteInDB,
  }
}
