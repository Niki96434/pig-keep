import type { Request, Response } from 'express'
import type { SearchQuery } from './types'
import type { RepositoryType } from './repository'

interface ControllerProps {
  repo: RepositoryType
}

export function controller({ repo }: ControllerProps) {
  const {
    getNotesFromDB,
    getNoteByIdFromDB,
    createNoteFromDB,
    putNoteFromDB,
    patchNoteFromDB,
    deleteNoteFromDB,
    clearTrashFromDB,
    restoreNoteFromDB,
    deleteByIdForeverFromDB,
    getNoteTagsFromDB,
    addTagToNoteInDB,
    removeTagFromNoteInDB,
  } = repo

  const getNotes = async (req: Request, res: Response) => {
    const { search, tagId, isArchive, isDeleted } = req.query as SearchQuery
    const notes = await getNotesFromDB({ search, tagId, isArchive, isDeleted })

    return res.status(200).json({ notes })
  }

  const getNoteById = async (req: Request<{ id: string }>, res: Response) => {
    const noteId = req.params.id
    const note = await getNoteByIdFromDB(noteId)

    if (!note) {
      return res.status(404).json({ error: 'Not found' })
    }

    return res.status(200).json({ note })
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

  const clearTrash = async (_req: Request, res: Response) => {
    await clearTrashFromDB()
    return res.status(200).json({ message: 'Success' })
  }

  const restoreNote = async (req: Request<{ id: string }>, res: Response) => {
    const noteId = req.params.id
    const result = await restoreNoteFromDB(noteId)

    if (result === 1) {
      return res.status(200).json({ message: 'Success' })
    }

    return res.status(404).json({ error: 'Not found' })
  }

  const deleteByIdForever = async (req: Request<{ id: string }>, res: Response) => {
    const noteId = req.params.id
    const deletedCount = await deleteByIdForeverFromDB(noteId)

    if (deletedCount === 1) {
      return res.status(200).json({ message: 'Success' })
    }

    return res.status(404).json({ error: 'Not found' })
  }

  const getNoteTags = async (req: Request<{ id: string }>, res: Response) => {
    const noteId = req.params.id
    const tags = await getNoteTagsFromDB(noteId)
    return res.status(200).json({ tags })
  }

  const addTagToNote = async (req: Request<{ id: string; tagId: string }>, res: Response) => {
    const { id: noteId, tagId } = req.params
    await addTagToNoteInDB(noteId, tagId)
    return res.status(200).json({ message: 'Success' })
  }

  const removeTagFromNote = async (req: Request<{ id: string; tagId: string }>, res: Response) => {
    const { id: noteId, tagId } = req.params
    await removeTagFromNoteInDB(noteId, tagId)
    return res.status(200).json({ message: 'Success' })
  }

  return {
    getNotes,
    getNoteById,
    createNote,
    putNote,
    patchNote,
    deleteNote,
    clearTrash,
    restoreNote,
    deleteByIdForever,
    getNoteTags,
    addTagToNote,
    removeTagFromNote,
  }
}
