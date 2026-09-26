import { api } from '@/shared/api'
import type { Note, NotePutIn } from '@shared/notes/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface EditNoteParams extends NotePutIn {
  id: Note['id']
}

export function useEditNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...body }: EditNoteParams) => api.notes.updateNote(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  })
}
