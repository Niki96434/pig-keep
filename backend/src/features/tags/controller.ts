import type { Request, Response } from 'express'
import type { TagCreateIn, Tag, TagPutIn, TagPatchIn } from '@app/shared/tags/types'
import { HttpStatus } from '@app/shared/constants/httpStatus'

interface RepositoryType {
  repo: {
    getTagsFromDB: (search: string | undefined) => Promise<Tag[]>
    getTagByIdFromDB: (tagId: string) => Promise<Tag | undefined>
    createTagFromDB: (tagData: TagCreateIn) => Promise<Tag | undefined>
    putTagFromDB: (tagId: string, tagData: TagPutIn) => Promise<Tag | undefined>
    patchTagFromDB: (tagId: string, tagData: TagPatchIn) => Promise<Tag | undefined>
    deleteTagFromDB: (tagId: string) => Promise<number | null>
  }
}

export function controller({ repo }: RepositoryType) {
  const {
    getTagsFromDB,
    getTagByIdFromDB,
    createTagFromDB,
    putTagFromDB,
    patchTagFromDB,
    deleteTagFromDB,
  } = repo

  const getTags = async (req: Request, res: Response) => {
    const search =
      typeof req.query.search === 'string' && req.query.search.trim()
        ? req.query.search.trim()
        : undefined
    const tags = await getTagsFromDB(search)

    return res.status(HttpStatus.OK).json({ tags })
  }

  const getTagById = async (req: Request<{ id: string }>, res: Response) => {
    const tagId = req.params.id
    const tag = await getTagByIdFromDB(tagId)

    if (!tag) {
      return res.status(HttpStatus.NOT_FOUND).json({ error: 'Not found' })
    }

    return res.status(HttpStatus.OK).json({ tag })
  }

  const createTag = async (req: Request, res: Response) => {
    const tagData = req.body

    const tag = await createTagFromDB(tagData)
    if (!tag) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Bad request' })
    }

    return res.status(HttpStatus.CREATED).json({ tag })
  }

  const putTag = async (req: Request<{ id: string }>, res: Response) => {
    const tagId = req.params.id
    const tagData = req.body
    const tag = await putTagFromDB(tagId, tagData)

    if (!tag) {
      return res.status(HttpStatus.NOT_FOUND).json({ error: 'Not found' })
    }

    return res.status(HttpStatus.OK).json({ tag })
  }

  const patchTag = async (req: Request<{ id: string }>, res: Response) => {
    const tagId = req.params.id
    const tagData = req.body
    const tag = await patchTagFromDB(tagId, tagData)

    if (!tag) {
      return res.status(HttpStatus.NOT_FOUND).json({ error: 'Not found' })
    }

    return res.status(HttpStatus.OK).json({ tag })
  }

  const deleteTag = async (req: Request<{ id: string }>, res: Response) => {
    const tagId = req.params.id
    const deletedRowCount = await deleteTagFromDB(tagId)

    if (deletedRowCount && deletedRowCount > 0) {
      return res.status(HttpStatus.OK).json({ message: 'Success' })
    }

    return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Bad request' })
  }

  return { getTags, getTagById, createTag, putTag, patchTag, deleteTag }
}
