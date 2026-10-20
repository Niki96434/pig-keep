import type { Request, Response, NextFunction } from 'express'
import * as z from 'zod'
import { DatabaseError } from 'pg'

export function globalErrorHandler(err: Error, _req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof z.ZodError) {
    return res.status(400).json({ error: 'Validation error' })
  }

  if (err instanceof DatabaseError) {
    return res.status(500).json({ error: 'Database error' })
  }

  res.status(500).json({ error: 'Internal server error' })
}
