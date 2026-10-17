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
  SearchQuerySchema,
} from '@app/shared/notes/validationSchemas'
import { trashController } from './trashController'
import { trashRepository } from './trashRepository'

export const notesRouter = express.Router()

const repo = repository({ db })
const {
  getNotes,
  getNoteById,
  createNote,
  putNote,
  patchNote,
  getNoteTags,
  addTagToNote,
  removeTagFromNote,
} = controller({ repo })

const trashRepo = trashRepository({ db })
const { clearTrash, restoreNote, deleteByIdForever } = trashController({ trashRepo })

notesRouter
  .get('/', validateSchemas({ query: SearchQuerySchema }), (req: Request, res: Response) =>
    getNotes(req, res)
  )
  .post('/', validateSchemas({ body: NoteCreateInSchema }), createNote)

notesRouter
  .delete('/trash', clearTrash)
  .delete('/trash/:id', validateSchemas({ params: NoteIdSchema }), deleteByIdForever)
  .patch('/trash/:id/restore', validateSchemas({ params: NoteIdSchema }), restoreNote)

notesRouter
  .route('/:id')
  .get(validateSchemas({ params: NoteIdSchema }), getNoteById)
  .put(validateSchemas({ params: NoteIdSchema, body: NotePutInSchema }), putNote)
  .patch(validateSchemas({ params: NoteIdSchema, body: NotePatchInSchema }), patchNote)

notesRouter
  .get('/:id/tags', validateSchemas({ params: NoteIdSchema }), getNoteTags)
  .post('/:id/tags/:tagId', addTagToNote)
  .delete('/:id/tags/:tagId', removeTagFromNote)
