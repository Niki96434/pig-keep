import { api, queryClient } from '@/shared/api'
import type { Tag, TagPutIn } from '@shared/tags/types'
import { useMutation } from '@tanstack/react-query'

export const useUpdateTagMutation = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: Tag['id']; data: TagPutIn }) =>
      api.tags.updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}
