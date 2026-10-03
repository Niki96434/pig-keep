import * as z from 'zod'

export const MAX_TAG_NAME_LENGTH = 255

export const TagIdSchema = z.object({
  id: z.uuid(),
})

export const TagCreateInSchema = z.object({
  name: z.string().trim().min(1, 'Tag name cannot be empty').max(MAX_TAG_NAME_LENGTH),
})

export const TagPutInSchema = TagCreateInSchema
export const TagPatchInSchema = TagCreateInSchema

export const TagSchema = TagIdSchema.merge(TagCreateInSchema)

export const TagSearchQuerySchema = z
  .object({
    search: z.string().optional(),
  })
  .readonly()
