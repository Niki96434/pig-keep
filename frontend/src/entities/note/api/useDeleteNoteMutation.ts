import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, type Note } from '@/shared/api'

export function useDeleteNoteMutation() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: async (id: Note['id']) => {
      const res = await apiClient.DELETE('/api/v1/notes/{id}', {
        params: { path: { id } },
      })
      if (res.error) throw res.error
      return res.data
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ['notes'] }),
  })
}
