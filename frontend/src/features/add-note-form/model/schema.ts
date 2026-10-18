import * as z from 'zod'

export const NoteCreateInSchema = z
  .object({
    title: z.string().trim().max(255).optional(),
    content: z.string().trim().max(1000).optional(),
  })
  .refine(
    (data) => Boolean(data.title?.trim()) || Boolean(data.content?.trim()),
    {
      message: 'At least one field must be specified: title or content',
    }
  )
