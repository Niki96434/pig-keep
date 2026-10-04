import type * as z from 'zod'
import type {
  PetIdSchema,
  PetMoodSchema,
  PetPatchInSchema,
  PetSchema,
} from './validationSchemas'

export type PetId = z.input<typeof PetIdSchema>
export type PetMood = z.output<typeof PetMoodSchema>
export type Pet = z.output<typeof PetSchema>

export type PetGetOut = {
  pet: Pet
}

export type PetsGetOut = {
  pets: Pet[]
  pet: Pet
}

export type PetPatchIn = z.input<typeof PetPatchInSchema>
