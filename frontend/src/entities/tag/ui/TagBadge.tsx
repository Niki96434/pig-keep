import type { MouseEvent } from 'react'
import { X } from 'lucide-react'
import styles from './TagBadge.module.css'
import { cn } from '@/shared/utils'

export interface TagBadgeProps {
  name: string
  onDelete?: (_e: MouseEvent<HTMLButtonElement>) => void
  className?: string
}

export function TagBadge({ name, onDelete, className }: TagBadgeProps) {
  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onDelete?.(e)
  }

  return (
    <div className={cn(styles.tag, className)}>
      <span className={styles.name} title={name}>
        {name}
      </span>
      {onDelete && (
        <button
          type="button"
          onClick={handleDelete}
          className={styles.deleteBtn}
          aria-label={`Удалить тег ${name}`}
        >
          <X className={styles.deleteIcon} />
        </button>
      )}
    </div>
  )
}
