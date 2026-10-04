import * as z from 'zod'

export const MAX_PET_NAME_LENGTH = 255

export const PetIdSchema = z.object({
  id: z.string().uuid(),
})

export const PetMoodSchema = z.enum(['happy', 'neutral', 'sad', 'sleeping'])

export const PetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(MAX_PET_NAME_LENGTH),
  level: z.number().int().min(1),
  progress: z.number().int().min(0),
  requiredXp: z.number().int().min(1),
  pleasureIndex: z.number().int().min(0).max(100),
  mood: PetMoodSchema,
})

export const PetPatchInSchema = z.object({
  name: z.string().trim().min(1).max(MAX_PET_NAME_LENGTH).optional(),
  pleasureIndex: z.number().int().min(0).max(100).optional(),
})

export function getPetMood(pleasureIndex: number): z.infer<typeof PetMoodSchema> {
  if (pleasureIndex >= 80) return 'happy'
  if (pleasureIndex >= 40) return 'neutral'
  if (pleasureIndex > 0) return 'sad'
  return 'sleeping'
}
