import { api } from '@/shared/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Note, NotePatchIn } from '@shared/notes/types'

export interface PatchNoteParams {
  id: Note['id']
  data: NotePatchIn
}

export function usePatchNoteMutation() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: PatchNoteParams) => api.notes.patchNote(id, data),
    onSuccess: () => client.invalidateQueries({ queryKey: ['notes'] }),
  })
}
