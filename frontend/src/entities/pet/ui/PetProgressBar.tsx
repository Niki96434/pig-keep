export interface PetProgressBarProps {
  progress: number
  requiredXp: number
  className?: string
}

export function PetProgressBar({
  progress,
  requiredXp,
  className = '',
}: PetProgressBarProps) {
  const percentage =
    requiredXp > 0
      ? Math.min(100, Math.max(0, (progress / requiredXp) * 100))
      : 0

  return (
    <div
      role="progressbar"
      aria-label="Опыт питомца"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={requiredXp}
      className={`w-full h-2.5 rounded-full overflow-hidden ${className}`}
      style={{ backgroundColor: '#ffe0e6' }}
    >
      <div
        data-testid="pet-progress-fill"
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${percentage}%`,
          backgroundColor: '#ff7285',
        }}
      />
    </div>
  )
}
