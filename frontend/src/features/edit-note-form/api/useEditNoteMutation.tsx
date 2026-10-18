import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, type Note, type NotePutIn } from '@/shared/api'

export interface EditNoteParams extends NotePutIn {
  id: Note['id']
}

export function useEditNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...body }: EditNoteParams) => {
      const res = await apiClient.PUT('/api/v1/notes/{id}', {
        params: { path: { id } },
        body,
      })
      if (res.error) throw res.error
      return res.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  })
}
