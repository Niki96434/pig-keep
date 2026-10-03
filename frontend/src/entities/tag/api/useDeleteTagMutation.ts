import { api, queryClient } from '@/shared/api'
import type { Tag } from '@shared/tags/types'
import { useMutation } from '@tanstack/react-query'

export const useDeleteTagMutation = () => {
  return useMutation({
    mutationFn: (id: Tag['id']) => api.tags.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
