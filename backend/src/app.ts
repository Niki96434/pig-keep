import express from 'express'
import { notesRouter } from './features/notes/router'
import { tagsRouter } from './features/tags/router'
import { globalErrorHandler } from './core/globalErrorHandler'
import cors from 'cors'
import { HttpStatus } from '@app/shared/constants/httpStatus'

export const app = express()

const corsOptions = {
  origin: process.env.ORIGIN,
  optionsSuccessStatus: HttpStatus.OK,
}

app.use(express.json())
app.use(cors(corsOptions))
app.use('/api/v1/notes', notesRouter)
app.use('/api/v1/tags', tagsRouter)
app.use(globalErrorHandler)
