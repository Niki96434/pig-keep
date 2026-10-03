import { controller } from './controller'
import { repository } from './repository'
import { db } from '../../core/db/'
import { type Request, type Response } from 'express'
import express from 'express'
import { validateSchemas } from '../../core/middlewares/validateSchemas'
import {
  NoteCreateInSchema,
  NotePutInSchema,
  NoteIdSchema,
  NotePatchInSchema,
} from '@app/shared/notes/validationSchemas'
import type { SearchQuery } from '@app/shared/notes/types'

export const notesRouter = express.Router()

const repo = repository({ db })
const {
  getNotes,
  getNoteById,
  createNote,
  putNote,
  patchNote,
  deleteNote,
  getNoteTags,
  addTagToNote,
  removeTagFromNote,
} = controller({ repo })

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
notesRouter.get('/', (req: Request<{}, {}, {}, SearchQuery>, res: Response) => getNotes(req, res))

notesRouter.post('/', validateSchemas({ body: NoteCreateInSchema }), createNote)

notesRouter
  .route('/:id')
  .get(validateSchemas({ params: NoteIdSchema }), getNoteById)
  .put(validateSchemas({ params: NoteIdSchema, body: NotePutInSchema }), putNote)
  .patch(validateSchemas({ params: NoteIdSchema, body: NotePatchInSchema }), patchNote)
  .delete(validateSchemas({ params: NoteIdSchema }), deleteNote)

notesRouter.get('/:id/tags', validateSchemas({ params: NoteIdSchema }), getNoteTags)
notesRouter.post('/:id/tags/:tagId', addTagToNote)
notesRouter.delete('/:id/tags/:tagId', removeTagFromNote)
