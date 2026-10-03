import type z from 'zod'
import type { Request, Response, NextFunction } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'

interface ValidationSchemas {
  params?: z.ZodSchema
  body?: z.ZodSchema
  query?: z.ZodSchema
}

export function validateSchemas(schemas: ValidationSchemas) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.params) {
        req.params = (await schemas.params.parseAsync(req.params)) as ParamsDictionary
      }
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body)
      }
      if (schemas.query) {
        const parsed = await schemas.query.parseAsync(req.query)
        Object.assign(req.query, parsed)
      }

      next()
    } catch (err) {
      next(err)
    }
  }
}

