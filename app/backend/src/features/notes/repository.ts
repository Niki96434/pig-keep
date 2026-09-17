import type { NoteCreateIn, NoteUpdateIn } from '@shared/notes/types'
import { db } from '../../core/db/'
import { notesTable } from './schema'
import { eq } from 'drizzle-orm'

interface DBType {
  db: typeof db
}

export function repository({ db }: DBType) {
  const getNotesFromDB = async () => {
    return await db.select().from(notesTable)
  }

  const createNoteFromDB = async (noteData: NoteCreateIn) => {
    const [note] = await db
      .insert(notesTable)
      .values({ ...noteData })
      .returning()
    return note
  }

  const updateNoteFromDB = async (noteId: string, noteData: NoteUpdateIn) => {
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

  return { getNotesFromDB, createNoteFromDB, updateNoteFromDB, deleteNoteFromDB }
}
