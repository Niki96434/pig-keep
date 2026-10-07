import type { Request, Response } from 'express'
import type {
  NoteCreateIn,
  Note,
  NotePutIn,
  NotePatchIn,
  SearchQuery,
} from '@app/shared/notes/types'

interface RepositoryType {
  repo: {
    getNotesFromDB: (params?: {
      search?: string | undefined
      tagId?: string | undefined
      isArchive?: boolean | undefined
      isDeleted?: boolean | undefined
    }) => Promise<Note[]>
    getNoteByIdFromDB: (noteId: string) => Promise<Note | undefined>
    createNoteFromDB: (noteData: NoteCreateIn) => Promise<Note | undefined>
    putNoteFromDB: (noteId: string, noteData: NotePutIn) => Promise<Note | undefined>
    patchNoteFromDB: (noteId: string, noteData: NotePatchIn) => Promise<Note | undefined>
    deleteNoteFromDB: (noteId: string) => Promise<number | null>
    getNoteTagsFromDB: (noteId: string) => Promise<{ id: string; name: string }[]>
    addTagToNoteInDB: (
      noteId: string,
      tagId: string
    ) => Promise<{ note_id: string; tag_id: string }[]>
    removeTagFromNoteInDB: (noteId: string, tagId: string) => Promise<number | null>
  }
}

export function controller({ repo }: RepositoryType) {
  const {
    getNotesFromDB,
    getNoteByIdFromDB,
    createNoteFromDB,
    putNoteFromDB,
    patchNoteFromDB,
    deleteNoteFromDB,
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
    getNoteTags,
    addTagToNote,
    removeTagFromNote,
  }
}
