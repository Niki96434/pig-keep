import { db } from '../../core/db'
import { notesTable } from '../../core/db/schema'
import { eq, and } from 'drizzle-orm'

interface DBType {
  db: typeof db
}

export type TrashRepositoryType = ReturnType<typeof trashRepository>

export function trashRepository({ db }: DBType) {
  const clearTrash = async () => {
    const result = await db.delete(notesTable).where(eq(notesTable.isDeleted, true))

    return result.rowCount ?? 0
  }

  const restoreNote = async (id: string) => {
    const result = await db
      .update(notesTable)
      .set({ isDeleted: false })
      .where(and(eq(notesTable.id, id), eq(notesTable.isDeleted, true)))

    return result.rowCount ?? 0
  }

  const deleteByIdForever = async (id: string) => {
    const result = await db
      .delete(notesTable)
      .where(and(eq(notesTable.id, id), eq(notesTable.isDeleted, true)))

    return result.rowCount ?? 0
  }

  return { clearTrash, restoreNote, deleteByIdForever }
}
