import * as z from 'zod'

export const NotePutInSchema = z.object({
  title: z.string().trim().max(255),
  content: z.string().trim().max(1000),
})
