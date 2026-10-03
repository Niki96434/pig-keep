import type { Request, Response } from 'express'
import type { NoteCreateIn, Note, NotePutIn, NotePatchIn, SearchQuery } from '@app/shared/notes/types'
import { HttpStatus } from '@app/shared/constants/httpStatus'

interface RepositoryType {
  repo: {
    getNotesFromDB: (params?: {
      search?: string | undefined
      tagId?: string | undefined
      isArchive?: boolean | undefined
    }) => Promise<Note[]>
    getNoteByIdFromDB: (noteId: string) => Promise<Note | undefined>
    createNoteFromDB: (noteData: NoteCreateIn) => Promise<Note | undefined>
    putNoteFromDB: (noteId: string, noteData: NotePutIn) => Promise<Note | undefined>
    patchNoteFromDB: (noteId: string, noteData: NotePatchIn) => Promise<Note | undefined>
    deleteNoteFromDB: (noteId: string) => Promise<number | null>
    getNoteTagsFromDB: (noteId: string) => Promise<{ id: string; name: string }[]>
    addTagToNoteInDB: (noteId: string, tagId: string) => Promise<{ note_id: string; tag_id: string }[]>
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
    const { search, tagId, isArchive } = req.query as SearchQuery
    const notes = await getNotesFromDB({ search, tagId, isArchive })

    return res.status(HttpStatus.OK).json({ notes })
  }

  const getNoteById = async (req: Request<{ id: string }>, res: Response) => {
    const noteId = req.params.id
    const note = await getNoteByIdFromDB(noteId)

    if (!note) {
      return res.status(HttpStatus.NOT_FOUND).json({ error: 'Not found' })
    }

    return res.status(HttpStatus.OK).json({ note })
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

  const getNoteTags = async (req: Request<{ id: string }>, res: Response) => {
    const noteId = req.params.id
    const tags = await getNoteTagsFromDB(noteId)
    return res.status(HttpStatus.OK).json({ tags })
  }

  const addTagToNote = async (req: Request<{ id: string; tagId: string }>, res: Response) => {
    const { id: noteId, tagId } = req.params
    await addTagToNoteInDB(noteId, tagId)
    return res.status(HttpStatus.OK).json({ message: 'Success' })
  }

  const removeTagFromNote = async (req: Request<{ id: string; tagId: string }>, res: Response) => {
    const { id: noteId, tagId } = req.params
    await removeTagFromNoteInDB(noteId, tagId)
    return res.status(HttpStatus.OK).json({ message: 'Success' })
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
