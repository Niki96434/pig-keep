import type { Request, Response } from 'express'
import type { TagCreateIn, Tag, TagPutIn, TagPatchIn } from '@app/shared/tags/types'

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

    return res.status(200).json({ tags })
  }

  const getTagById = async (req: Request<{ id: string }>, res: Response) => {
    const tagId = req.params.id
    const tag = await getTagByIdFromDB(tagId)

    if (!tag) {
      return res.status(404).json({ error: 'Not found' })
    }

    return res.status(200).json({ tag })
  }

  const createTag = async (req: Request, res: Response) => {
    const tagData = req.body

    const tag = await createTagFromDB(tagData)
    if (!tag) {
      return res.status(400).json({ error: 'Bad request' })
    }

    return res.status(201).json({ tag })
  }

  const putTag = async (req: Request<{ id: string }>, res: Response) => {
    const tagId = req.params.id
    const tagData = req.body
    const tag = await putTagFromDB(tagId, tagData)

    if (!tag) {
      return res.status(404).json({ error: 'Not found' })
    }

    return res.status(200).json({ tag })
  }

  const patchTag = async (req: Request<{ id: string }>, res: Response) => {
    const tagId = req.params.id
    const tagData = req.body
    const tag = await patchTagFromDB(tagId, tagData)

    if (!tag) {
      return res.status(404).json({ error: 'Not found' })
    }

    return res.status(200).json({ tag })
  }

  const deleteTag = async (req: Request<{ id: string }>, res: Response) => {
    const tagId = req.params.id
    const deletedRowCount = await deleteTagFromDB(tagId)

    if (deletedRowCount && deletedRowCount > 0) {
      return res.status(200).json({ message: 'Success' })
    }

    return res.status(400).json({ error: 'Bad request' })
  }

  return { getTags, getTagById, createTag, putTag, patchTag, deleteTag }
}
