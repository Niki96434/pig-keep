import { Check, Bookmark, Trash2, Plus, Pencil, X } from 'lucide-react'
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
    editingTagId,
    editingTagName,
    setEditingTagName,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleCreate,
    handleDone,
    handleDelete,
    isCreating,
    isUpdating,
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
          {tags.map((tag) => {
            const isEditing = editingTagId === tag.id

            if (isEditing) {
              return (
                <div key={tag.id} className={styles.tagItem}>
                  <div className={styles.tagLeft}>
                    <Bookmark className={styles.tagIcon} />
                    <input
                      type="text"
                      className={styles.editInput}
                      value={editingTagName}
                      onChange={(e) => setEditingTagName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSaveEdit(tag.id)
                        } else if (e.key === 'Escape') {
                          e.preventDefault()
                          handleCancelEdit()
                        }
                      }}
                      autoFocus
                      aria-label="Редактировать название тега"
                    />
                  </div>
                  <div className={styles.tagActions}>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className={styles.actionBtn}
                      title="Отменить"
                      aria-label="Отменить редактирование"
                    >
                      <X size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(tag.id)}
                      className={styles.actionBtn}
                      disabled={!editingTagName.trim() || isUpdating}
                      title="Сохранить"
                      aria-label="Сохранить тег"
                    >
                      <Check size={15} />
                    </button>
                  </div>
                </div>
              )
            }

            return (
              <div key={tag.id} className={styles.tagItem}>
                <div className={styles.tagLeft}>
                  <Bookmark className={styles.tagIcon} />
                  <span className={styles.tagName}>{tag.name}</span>
                </div>
                <div className={styles.tagActions}>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(tag)}
                    className={styles.actionBtn}
                    title="Редактировать"
                    aria-label={`Редактировать тег ${tag.name}`}
                  >
                    <Pencil size={15} />
                  </button>
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
              </div>
            )
          })}
        </div>

        <div className={styles.footer}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDone}
            disabled={isCreating || isUpdating}
          >
            Готово
          </Button>
        </div>
      </div>
    </div>
  )
}

