import type { Request, Response } from 'express'
import type {
  NoteCreateIn,
  NoteCreateOut,
  Note,
  NoteUpdateOut,
  NotePutIn,
  NotePatchIn,
} from '@app/shared/types'

interface RepositoryType {
  repo: {
    getNotesFromDB: () => Promise<Note[]>
    createNoteFromDB: (noteData: NoteCreateIn) => Promise<NoteCreateOut | undefined>
    putNoteFromDB: (noteId: string, noteData: NotePutIn) => Promise<NoteUpdateOut | undefined>
    patchNoteFromDB: (noteId: string, noteData: NotePatchIn) => Promise<NoteUpdateOut | undefined>
    deleteNoteFromDB: (noteId: string) => Promise<number | null>
  }
}

export function controller({ repo }: RepositoryType) {
  const { getNotesFromDB, createNoteFromDB, putNoteFromDB, patchNoteFromDB, deleteNoteFromDB } =
    repo

  const getNotes = async (_req: Request, res: Response) => {
    const notes = await getNotesFromDB()

    return res.status(200).json({ notes })
  }

  const createNote = async (req: Request, res: Response) => {
    const noteData = req.body

    const note = await createNoteFromDB(noteData)
    if (!note) {
      return res.status(400).json({ error: 'Bad request' })
    }

    return res.status(201).json({ note })
  }

  const putNote = async (req: Request<{ id: string }>, res: Response) => {
    const noteId = req.params.id
    const noteData = req.body
    const note = await putNoteFromDB(noteId, noteData)

    if (!note) {
      return res.status(404).json({ error: 'Not found' })
    }

    return res.status(200).json({ note })
  }

  const patchNote = async (req: Request<{ id: string }>, res: Response) => {
    const noteId = req.params.id
    const noteData = req.body
    const note = await patchNoteFromDB(noteId, noteData)

    if (!note) {
      return res.status(404).json({ error: 'Not found' })
    }

    return res.status(200).json({ note })
  }

  const deleteNote = async (req: Request<{ id: string }>, res: Response) => {
    const noteId = req.params.id
    const deletedRowCount = await deleteNoteFromDB(noteId)

    if (deletedRowCount && deletedRowCount > 0) {
      return res.status(200).json({ message: 'Success' })
    }

    return res.status(400).json({ error: 'Bad request' })
  }

  return { getNotes, createNote, putNote, patchNote, deleteNote }
}
