import { controller } from './controller'
import { repository } from './repository'
import { db } from '../../core/db/'
import { type Request, type Response } from 'express'
import express from 'express'
import { validateSchemas } from '../../core/middlewares/validateSchemas'
import {
  TagCreateInSchema,
  TagPutInSchema,
  TagIdSchema,
  TagPatchInSchema,
} from '@app/shared/tags/validationSchemas'
import type { TagSearchQuery } from '@app/shared/tags/types'

export const tagsRouter = express.Router()

const repo = repository({ db })
const { getTags, getTagById, createTag, putTag, patchTag, deleteTag } = controller({ repo })

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
tagsRouter.get('/', (req: Request<{}, {}, {}, TagSearchQuery>, res: Response) => getTags(req, res))

tagsRouter.post('/', validateSchemas({ body: TagCreateInSchema }), createTag)

tagsRouter
  .route('/:id')
  .get(validateSchemas({ params: TagIdSchema }), getTagById)
  .put(validateSchemas({ params: TagIdSchema, body: TagPutInSchema }), putTag)
  .patch(validateSchemas({ params: TagIdSchema, body: TagPatchInSchema }), patchTag)
  .delete(validateSchemas({ params: TagIdSchema }), deleteTag)
