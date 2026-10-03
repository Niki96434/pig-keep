import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/shared/api'
import type { NoteCreateIn } from '@shared/notes/types'

export interface CreateNoteParams extends NoteCreateIn {
  tagId?: string
}

export function useCreateNoteMutation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ tagId, ...data }: CreateNoteParams) => {
      const response = await api.notes.createNote(data)
      if (tagId && response.note?.id) {
        await api.notes.addTagToNote(response.note.id, tagId)
      }
      return response
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  })

  return mutation
}

