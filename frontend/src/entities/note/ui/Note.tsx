import type { Note } from '@shared/notes/types'
import styles from './Note.module.css'
import menuIcon from './../assets/three-dots.png'
import { PencilIcon, TrashIcon } from 'lucide-react'
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
import { useDeleteNoteMutation } from '../api/useDeleteNoteMutation'
import {
  useGetNoteTagsQuery,
  useAddTagToNoteMutation,
  useRemoveTagFromNoteMutation,
} from '../api/useNoteTags'
import { useGetTagsQuery, TagBadge } from '@/entities/tag'
import { useEditNoteStore } from '@/stores/edit-note/editNoteStore'

type NoteProps = Pick<Note, 'id' | 'title' | 'content'>

export function Note({ id, title, content }: NoteProps) {
  const actions = useEditNoteStore((state) => state.actions)

  function openEditForm(id: string) {
    actions.setOpenEditForm()
    actions.setId(id)
  }

  const delMutation = useDeleteNoteMutation()
  const { data: noteTagsData } = useGetNoteTagsQuery(id)
  const { data: allTagsData } = useGetTagsQuery()
  const addTagMutation = useAddTagToNoteMutation()
  const removeTagMutation = useRemoveTagFromNoteMutation()

  const noteTags = noteTagsData?.tags ?? []
  const allTags = allTagsData?.tags ?? []

  const handleToggleTag = (tagId: string, isAttached: boolean) => {
    if (isAttached) {
      removeTagMutation.mutate({ noteId: id, tagId })
    } else {
      addTagMutation.mutate({ noteId: id, tagId })
    }
  }

  const handleRemoveTag = (tagId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeTagMutation.mutate({ noteId: id, tagId })
  }

  return (
    <div className={styles.container} onClick={() => openEditForm(id)}>
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

        <div onClick={(e) => e.stopPropagation()}>
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
                  onClick={() => delMutation.mutate(id)}
                  disabled={delMutation.isPending}
                >
                  <TrashIcon />
                  {delMutation.isPending ? 'Удаление...' : 'Удалить'}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
