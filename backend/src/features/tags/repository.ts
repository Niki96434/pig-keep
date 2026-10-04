import type { TagCreateIn, TagPatchIn, TagPutIn } from '@app/shared/tags/types'
import { db } from '../../core/db/'
import { tagsTable } from '../../core/db/schema'
import { eq, sql } from 'drizzle-orm'
import { repository as petsRepository } from '../pets/repository'

interface DBType {
  db: typeof db
}

export function repository({ db }: DBType) {
  const petRepo = petsRepository({ db })

  const getTagsFromDB = async (search: string | undefined) => {
    if (search) {
      return await db
        .select()
        .from(tagsTable)
        .where(
          sql`to_tsvector('russian', coalesce(${tagsTable.name}, '')) @@ websearch_to_tsquery('russian', ${search})`
        )
        .limit(10)
    }
    return await db.select().from(tagsTable)
  }

  const getTagByIdFromDB = async (tagId: string) => {
    const [tag] = await db.select().from(tagsTable).where(eq(tagsTable.id, tagId))
    return tag
  }

  const createTagFromDB = async (tagData: TagCreateIn) => {
    const [tag] = await db
      .insert(tagsTable)
      .values({ ...tagData })
      .returning()
    if (tag) {
      try {
        await petRepo.logAction('create_tag')
      } catch {
        // Logging error shouldn't block primary user flow
      }
    }
    return tag
  }

  const putTagFromDB = async (tagId: string, tagData: TagPutIn) => {
    if (Object.keys(tagData).length === 0) {
      const [tag] = await db.select().from(tagsTable).where(eq(tagsTable.id, tagId))
      return tag
    }
    const [tag] = await db
      .update(tagsTable)
      .set({ ...tagData })
      .where(eq(tagsTable.id, tagId))
      .returning()

    return tag
  }

  const patchTagFromDB = async (tagId: string, tagData: TagPutIn | TagPatchIn) => {
    if (Object.keys(tagData).length === 0) {
      const [tag] = await db.select().from(tagsTable).where(eq(tagsTable.id, tagId))
      return tag
    }
    const [tag] = await db
      .update(tagsTable)
      .set({ ...tagData })
      .where(eq(tagsTable.id, tagId))
      .returning()

    return tag
  }

  const deleteTagFromDB = async (tagId: string) => {
    const result = await db.delete(tagsTable).where(eq(tagsTable.id, tagId))
    if (result.rowCount) {
      try {
        await petRepo.logAction('delete_tag')
      } catch {
        // Logging error shouldn't block primary user flow
      }
    }
    return result.rowCount
  }

  return {
    getTagsFromDB,
    getTagByIdFromDB,
    createTagFromDB,
    putTagFromDB,
    patchTagFromDB,
    deleteTagFromDB,
  }
}
