import type { Pet, PetMood, PetGetOut, PetPatchIn } from '@shared/pets/types'

export type { Pet, PetMood, PetGetOut, PetPatchIn }

export const MOOD_LABELS: Record<PetMood, string> = {
  happy: 'Счастлив',
  neutral: 'Обычный',
  sad: 'Грустит',
  sleeping: 'Спит',
}
