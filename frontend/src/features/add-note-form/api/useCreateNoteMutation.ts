import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, type NoteCreateIn } from '@/shared/api'

export interface CreateNoteParams extends NoteCreateIn {
  tagId?: string
}

export function useCreateNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ tagId, ...data }: CreateNoteParams) => {
      const res = await apiClient.POST('/api/v1/notes', { body: data })
      if (res.error) throw res.error

      if (tagId && res.data.note?.id) {
        const tagRes = await apiClient.POST('/api/v1/notes/{id}/tags/{tagId}', {
          params: { path: { id: res.data.note.id, tagId } },
        })
        if (tagRes.error) throw tagRes.error
      }

      return res.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  })
}
