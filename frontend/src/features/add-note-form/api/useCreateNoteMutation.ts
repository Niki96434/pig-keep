import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/shared/api'
import type { NoteCreateIn } from '@shared/notes/types'

export function useCreateNoteMutation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: NoteCreateIn) => api.notes.createNote(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  })

  return mutation
}
