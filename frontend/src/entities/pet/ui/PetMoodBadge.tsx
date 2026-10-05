import { MOOD_LABELS, type PetMood } from '../model/types'

export interface PetMoodBadgeProps {
  mood: PetMood
  className?: string
}

export function PetMoodBadge({ mood, className = '' }: PetMoodBadgeProps) {
  const label = MOOD_LABELS[mood] ?? 'Обычный'

  return (
    <span
      className={`inline-flex items-center justify-center bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-xs border border-rose-100 tracking-wide ${className}`}
    >
      {label}
    </span>
  )
}
