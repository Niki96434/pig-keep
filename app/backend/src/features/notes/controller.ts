import type { Request, Response } from 'express'
import type {
  NoteCreateIn,
  NoteCreateOut,
  Note,
  NoteUpdateOut,
  NotePutIn,
  NotePatchIn,
} from '@shared/notes/types'
import { HttpStatus } from '@shared/constants/httpStatus'

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

    return res.status(HttpStatus.OK).json({ notes })
  }

  const createNote = async (req: Request, res: Response) => {
    const noteData = req.body

    const note = await createNoteFromDB(noteData)
    if (!note) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Bad request' })
    }

    return res.status(HttpStatus.CREATED).json({ note })
  }

  const putNote = async (req: Request<{ id: string }>, res: Response) => {
    const noteId = req.params.id
    const noteData = req.body
    const note = await putNoteFromDB(noteId, noteData)

    if (!note) {
      return res.status(HttpStatus.NOT_FOUND).json({ error: 'Not found' })
    }

    return res.status(HttpStatus.OK).json({ note })
  }

  const patchNote = async (req: Request<{ id: string }>, res: Response) => {
    const noteId = req.params.id
    const noteData = req.body
    const note = await patchNoteFromDB(noteId, noteData)

    if (!note) {
      return res.status(HttpStatus.NOT_FOUND).json({ error: 'Not found' })
    }

    return res.status(HttpStatus.OK).json({ note })
  }

  const deleteNote = async (req: Request<{ id: string }>, res: Response) => {
    const noteId = req.params.id
    const deletedRowCount = await deleteNoteFromDB(noteId)

    if (deletedRowCount && deletedRowCount > 0) {
      return res.status(HttpStatus.OK).json({ message: 'Success' })
    }

    return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Bad request' })
  }

  return { getNotes, createNote, putNote, patchNote, deleteNote }
}
