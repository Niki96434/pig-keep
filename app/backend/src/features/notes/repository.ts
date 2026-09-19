import type { NoteCreateIn, NotePatchIn, NotePutIn } from '@shared/notes/types'
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

  return { getNotesFromDB, createNoteFromDB, putNoteFromDB, patchNoteFromDB, deleteNoteFromDB }
}
