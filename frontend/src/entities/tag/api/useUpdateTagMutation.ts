import { useMutation } from '@tanstack/react-query'
import { apiClient, queryClient, type Tag, type TagPutIn } from '@/shared/api'

export const useUpdateTagMutation = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: Tag['id']; data: TagPutIn }) => {
      const res = await apiClient.PUT('/api/v1/tags/{id}', {
        params: { path: { id } },
        body: data,
      })
      if (res.error) throw res.error
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}
