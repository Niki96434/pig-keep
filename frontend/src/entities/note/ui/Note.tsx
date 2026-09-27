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
} from '@/shared/ui/menu/dropdown-menu'
import { useDeleteNoteMutation } from '../api/useDeleteNoteMutation'
import { useEditNoteStore } from '@/stores/edit-note/editNoteStore'

type NoteProps = Pick<Note, 'id' | 'title' | 'content'>

export function Note({ id, title, content }: NoteProps) {
  const actions = useEditNoteStore((state) => state.actions)

  function openEditForm(id: string) {
    actions.setOpenEditForm()
    actions.setId(id)
  }

  const delMutation = useDeleteNoteMutation()

  return (
    <div className={styles.container} onClick={() => openEditForm(id)}>
      <p className={styles.title}>{title}</p>
      <p className={styles.content}>{content}</p>
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
              <DropdownMenuItem>
                <PencilIcon />
                {'Добавить в ярлык'}
              </DropdownMenuItem>
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
  )
}
