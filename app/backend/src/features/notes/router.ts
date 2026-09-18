import { controller } from './controller'
import { repository } from './repository'
import { db } from '../../core/db/'
import express from 'express'
import { validateSchemas } from '../../core/middlewares/validateSchemas'
import {
  NoteCreateInSchema,
  NotePutInSchema,
  NoteIdSchema,
  NotePatchInSchema,
} from '@shared/notes/validationSchemas'

export const notesRouter = express.Router()

const repo = repository({ db })
const { getNotes, createNote, putNote, patchNote, deleteNote } = controller({ repo })

notesRouter.get('/', getNotes)

notesRouter.post('/', validateSchemas({ body: NoteCreateInSchema }), createNote)

notesRouter
  .route('/:id')
  .put(validateSchemas({ params: NoteIdSchema, body: NotePutInSchema }), putNote)
  .patch(validateSchemas({ params: NoteIdSchema, body: NotePatchInSchema }), patchNote)

notesRouter.delete('/:id', validateSchemas({ params: NoteIdSchema }), deleteNote)
