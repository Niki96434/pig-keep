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
import { useMutation } from '@tanstack/react-query'
import { axiosInstance, queryClient } from '@/shared/api'

type NoteProps = Pick<Note, 'id' | 'title' | 'content'>

function useEditNoteMutation() {
  return useMutation({
    mutationFn: (id: Note['id']) => axiosInstance.put(`/api/v1/notes/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  })
}

export function Note({ id, title, content }: NoteProps) {
  const editMutation = useEditNoteMutation()
  const delMutation = useDeleteNoteMutation()

  return (
    <div className={styles.container}>
      <p className={styles.title}>{title}</p>
      <p className={styles.content}>{content}</p>
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
            <DropdownMenuItem
              onClick={() => editMutation.mutate(id)}
              disabled={editMutation.isPending}
            >
              <PencilIcon />
              {editMutation.isPending ? 'Редактируется...' : 'Редактировать'}
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
  )
}
