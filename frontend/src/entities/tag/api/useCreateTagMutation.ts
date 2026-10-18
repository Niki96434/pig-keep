import { useMutation } from '@tanstack/react-query'
import { apiClient, queryClient, type TagCreateIn } from '@/shared/api'

export const useCreateTagMutation = () => {
  return useMutation({
    mutationFn: async (data: TagCreateIn) => {
      const res = await apiClient.POST('/api/v1/tags', { body: data })
      if (res.error) throw res.error
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
