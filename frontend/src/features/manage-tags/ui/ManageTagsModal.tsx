import { Check, Bookmark, Trash2, Plus } from 'lucide-react'
import { Button } from '@/shared/ui'
import { useManageTagsModal } from '../model/useManageTagsModal'
import styles from './ManageTagsModal.module.css'

export function ManageTagsModal() {
  const {
    isOpen,
    close,
    tags,
    tagName,
    setTagName,
    handleCreate,
    handleDone,
    handleDelete,
    isCreating,
  } = useManageTagsModal()

  if (!isOpen) return null

  return (
    <div className={styles.backdrop} onClick={close}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Создать / Изменить теги</h3>

        <form onSubmit={handleCreate} className={styles.inputRow}>
          <input
            type="text"
            className={styles.input}
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Новый тег..."
            autoFocus
          />
          <button
            type="submit"
            className={styles.iconBtn}
            disabled={!tagName.trim() || isCreating}
            aria-label="Создать тег"
          >
            {tagName.trim() ? <Check size={16} /> : <Plus size={16} />}
          </button>
        </form>

        <div className={styles.tagList}>
          {tags.map((tag) => (
            <div key={tag.id} className={styles.tagItem}>
              <div className={styles.tagLeft}>
                <Bookmark className={styles.tagIcon} />
                <span className={styles.tagName}>{tag.name}</span>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(tag.id)}
                className={styles.deleteBtn}
                title="Удалить"
                aria-label={`Удалить тег ${tag.name}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDone}
            disabled={isCreating}
          >
            Готово
          </Button>
        </div>
      </div>
    </div>
  )
}
