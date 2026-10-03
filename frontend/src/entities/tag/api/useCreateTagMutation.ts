import { api, queryClient } from '@/shared/api'
import type { TagCreateIn } from '@shared/tags/types'
import { useMutation } from '@tanstack/react-query'

export const useCreateTagMutation = () => {
  return useMutation({
    mutationFn: (data: TagCreateIn) => api.tags.createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
