import type z from 'zod'
import type { Request, Response, NextFunction } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'

interface ValidationSchemas {
  params?: z.ZodSchema
  body?: z.ZodSchema
}

export function validateSchemas(schemas: ValidationSchemas) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (schemas.params) {
      req.params = (await schemas.params.parseAsync(req.params)) as ParamsDictionary
    }
    if (schemas.body) {
      req.body = await schemas.body.parseAsync(req.body)
    }

    next()
  }
}
