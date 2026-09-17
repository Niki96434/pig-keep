import { controller } from './controller'
import { repository } from './repository'
import { db } from '../../core/db/'
import express from 'express'
import { validateSchemas } from '../../core/middlewares/validateSchemas'
import {
  NoteCreateInSchema,
  NoteUpdateInSchema,
  NoteIdSchema,
  NotePartialUpdateInSchema,
} from '@shared/notes/validationSchemas'

export const notesRouter = express.Router()

const repo = repository({ db })
const { getNotes, createNote, updateNote, deleteNote } = controller({ repo })

notesRouter.get('/', getNotes)

notesRouter.post('/', validateSchemas({ body: NoteCreateInSchema }), createNote)

notesRouter
  .route('/:id')
  .put((req, res) => {
    validateSchemas({ params: NoteIdSchema, body: NoteUpdateInSchema })
    updateNote(req, res)
  })
  .patch((req, res) => {
    validateSchemas({ params: NoteIdSchema, body: NotePartialUpdateInSchema })
    updateNote(req, res)
  })

notesRouter.delete('/:id', validateSchemas({ params: NoteIdSchema }), deleteNote)
