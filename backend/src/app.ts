import express from 'express'
import type { Request, Response } from 'express'
import { notesRouter } from './features/notes/router'
import { tagsRouter } from './features/tags/router'
import { globalErrorHandler } from './core/globalErrorHandler'
import cors from 'cors'
import path from 'node:path'

export const app = express()

const corsOptions = {
  origin: process.env.ORIGIN,
  optionsSuccessStatus: 200,
}

app.use(express.json())
app.use(cors(corsOptions))
app.use('/api/v1/notes', notesRouter)
app.use('/api/v1/tags', tagsRouter)
app.use(globalErrorHandler)

const staticBundlePath = path.join(process.cwd(), 'frontend/public')

app.use(express.static(staticBundlePath))

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(staticBundlePath, 'index.html'))
})
