import { Heart } from 'lucide-react'
import { useGetPetQuery } from '../api/useGetPet'
import borisImage from '../assets/boris.png'
import { MOOD_LABELS, type Pet } from '../model/types'
import { PetMoodBadge } from './PetMoodBadge'
import { PetProgressBar } from './PetProgressBar'
import styles from './PetCard.module.css'

export interface PetCardProps {
  pet?: Pet
  className?: string
}

export function PetCard({ pet: propPet, className = '' }: PetCardProps) {
  const { data, isLoading } = useGetPetQuery()
  const pet = propPet ?? data?.pet

  // Fallback / Loading state
  const currentPet: Pet = pet ?? {
    id: 'default',
    name: 'Борис',
    level: 1,
    progress: 0,
    requiredXp: 500,
    pleasureIndex: 100,
    mood: 'happy',
  }

  const moodText = MOOD_LABELS[currentPet.mood] ?? 'Счастлив'
  const displayName = `Свин ${currentPet.name}`

  return (
    <div
      className={`${styles.petCard} p-4 sm:p-5 w-full select-none ${className}`}
      data-testid="pet-card"
    >
      {/* DESKTOP LAYOUT (>= 1024px) */}
      <div className={`${styles.desktopLayout} gap-4.5`}>
        {/* Header: СВИНОМЕТР + Mood Badge */}
        <div className={styles.svinometerHeader}>
          <div className={styles.svinometerLabel}>
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>СВИНОМЕТР</span>
          </div>
          <PetMoodBadge mood={currentPet.mood} />
        </div>

        {/* Big Illustration */}
        <div className={`${styles.illustrationContainer} p-4 aspect-square w-full`}>
          <img
            src={borisImage}
            alt={displayName}
            className={`w-full h-full object-contain ${
              isLoading ? 'opacity-70 animate-pulse' : ''
            }`}
          />
        </div>

        {/* Footer info: Name, Level, Progress Bar and XP numbers */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-900 text-base tracking-tight">
              {displayName}
            </span>
            <span className="text-sm font-semibold text-rose-400">
              уровень {currentPet.level}
            </span>
          </div>

          <PetProgressBar
            progress={currentPet.progress}
            requiredXp={currentPet.requiredXp}
          />

          <div className="flex items-center justify-between text-xs text-gray-500 pt-0.5">
            <span>ХР до следующего уровня</span>
            <span className="font-bold text-gray-800">
              {currentPet.progress}/{currentPet.requiredXp}
            </span>
          </div>
        </div>
      </div>

      {/* MOBILE LAYOUT (< 1024px) */}
      <div className={`${styles.mobileLayout} items-center gap-3.5`}>
        {/* Left: Thumbnail Boris */}
        <div
          className={`${styles.illustrationContainer} w-16 h-16 sm:w-20 sm:h-20 shrink-0 p-1.5`}
        >
          <img
            src={borisImage}
            alt={displayName}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right: Info + Progress */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-gray-900 text-sm sm:text-base truncate">
              {displayName}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-rose-400 shrink-0">
              уровень {currentPet.level}
            </span>
          </div>

          <PetProgressBar
            progress={currentPet.progress}
            requiredXp={currentPet.requiredXp}
          />

          <div className="flex items-center justify-between text-xs text-gray-600">
            <span className="font-medium text-gray-700">{moodText}</span>
            <span className="font-semibold text-gray-800">
              {currentPet.progress}/{currentPet.requiredXp} XP
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
