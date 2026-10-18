import { useMutation } from '@tanstack/react-query'
import { apiClient, queryClient, type Tag } from '@/shared/api'

export const useDeleteTagMutation = () => {
  return useMutation({
    mutationFn: async (id: Tag['id']) => {
      const res = await apiClient.DELETE('/api/v1/tags/{id}', {
        params: { path: { id } },
      })
      if (res.error) throw res.error
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
