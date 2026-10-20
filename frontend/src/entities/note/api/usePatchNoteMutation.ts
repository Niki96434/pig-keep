import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, type Note, type NotePatchIn } from '@/shared/api'

export interface PatchNoteParams {
  id: Note['id']
  data: NotePatchIn
}

export function usePatchNoteMutation() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: PatchNoteParams) => {
      const res = await apiClient.PATCH('/api/v1/notes/{id}', {
        params: { path: { id } },
        body: data,
      })
      if (res.error) throw res.error
      return res.data
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ['notes'] }),
  })
}
