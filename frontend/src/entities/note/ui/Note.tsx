import type { Note as NoteType } from '@shared/notes/types'
import styles from './Note.module.css'
import menuIcon from './../assets/three-dots.png'
import { Archive, PencilIcon, TrashIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/shared/ui'
import { TagBadge } from '@/entities/tag'
import { useNoteLogic } from '../model/useNoteLogic'

export interface NoteProps extends Pick<NoteType, 'id' | 'title' | 'content'> {
  isArchive?: boolean | null
}

export function Note({ id, title, content, isArchive }: NoteProps) {
  const {
    noteTags,
    allTags,
    isDeleting,
    isPatching,
    handleCardClick,
    handleRemoveTag,
    handleToggleTag,
    handleToggleArchive,
    handleDeleteNote,
  } = useNoteLogic({ id, isArchive })

  return (
    <div className={styles.container} onClick={handleCardClick}>
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        <p className={styles.content}>{content}</p>
      </div>

      <div className={styles.footer}>
        <div className={styles.tagsContainer}>
          {noteTags.map((tag) => (
            <TagBadge
              key={tag.id}
              name={tag.name}
              onDelete={(e) => handleRemoveTag(tag.id, e)}
            />
          ))}
        </div>

        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={styles.wrapper}
            aria-label={isArchive ? 'Разархивировать' : 'Архивировать'}
            title={isArchive ? 'Разархивировать' : 'В архив'}
            onClick={handleToggleArchive}
            disabled={isPatching}
          >
            <Archive className={styles.icon} />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className={styles.wrapper}>
                  <img src={menuIcon} className={styles.menu} alt="Меню заметки" />
                </button>
              }
            />
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <PencilIcon />
                    <span>Добавить тег</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="min-w-44 max-h-56 overflow-y-auto">
                    {allTags.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-muted-foreground">Нет тегов</div>
                    ) : (
                      allTags.map((tag) => {
                        const isAttached = noteTags.some((t) => t.id === tag.id)
                        return (
                          <div
                            key={tag.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleTag(tag.id, isAttached)
                            }}
                            className="flex items-center gap-2.5 px-2.5 py-1.5 text-sm rounded-xl cursor-pointer hover:bg-[#faf6f0] transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={isAttached}
                              onChange={() => {}}
                              className="size-4 rounded cursor-pointer accent-[#2d2a26]"
                            />
                            <span className="truncate text-sm text-[#2d2a26]">{tag.name}</span>
                          </div>
                        )
                      })
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleDeleteNote}
                  disabled={isDeleting}
                >
                  <TrashIcon />
                  {isDeleting ? 'Удаление...' : 'Удалить'}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
