import { api } from '@/shared/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Note } from '@shared/notes/types'

export function useDeleteNoteMutation() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (noteId: Note['id']) => api.notes.deleteNote(noteId),
    onSuccess: () => client.invalidateQueries({ queryKey: ['notes'] }),
  })
}
