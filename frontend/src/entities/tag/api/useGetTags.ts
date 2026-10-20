import { useQuery } from '@tanstack/react-query'
import { apiClient, type TagsGetOut } from '@/shared/api'

export const useGetTagsQuery = (search?: string) => {
  return useQuery<TagsGetOut>({
    queryKey: ['tags', search],
    queryFn: async ({ signal }) => {
      const res = await apiClient.GET('/api/v1/tags', {
        signal,
        params: { query: { search: search?.trim() || undefined } },
      })
      if (res.error) throw res.error
      return res.data
    },
    placeholderData: { tags: [] },
  })
}
