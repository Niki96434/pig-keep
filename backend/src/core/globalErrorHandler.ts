import type { Request, Response, NextFunction } from 'express'
import * as z from 'zod'
import { DatabaseError } from 'pg'
import { HttpStatus } from '@app/shared/constants/httpStatus'

export function globalErrorHandler(err: Error, _req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof z.ZodError) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Validation error' })
  }

  if (err instanceof DatabaseError) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Database error' })
  }

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' })
}
