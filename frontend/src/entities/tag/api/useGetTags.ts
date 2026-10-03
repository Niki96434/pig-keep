import { api } from '@/shared/api'
import type { TagsGetOut } from '@shared/tags/types'
import { useQuery } from '@tanstack/react-query'

export const useGetTagsQuery = (search?: string) => {
  return useQuery<TagsGetOut>({
    queryKey: ['tags', search],
    queryFn: () => api.tags.getTags(search),
    placeholderData: { tags: [] },
  })
}
