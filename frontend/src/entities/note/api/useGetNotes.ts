import { useQuery } from '@tanstack/react-query'
import { apiClient, type NotesGetOut } from '@/shared/api'

export interface NoteFilters {
  searchValue?: string | undefined
  tagId?: string | undefined
  isArchive?: boolean | undefined
  isDeleted?: boolean | undefined
}

export const useGetNotesQuery = (filters?: NoteFilters) => {
  return useQuery<NotesGetOut>({
    queryKey: ['notes', filters],
    queryFn: async ({ signal }) => {
      const { data, error } = await apiClient.GET('/api/v1/notes', {
        signal,
        params: {
          query: {
            search: filters?.searchValue?.trim() || undefined,
            tagId: filters?.tagId,
            isArchive: filters?.isArchive,
            isDeleted: filters?.isDeleted,
          },
        },
      })
      if (error) throw error
      return data
    },
    placeholderData: { notes: [] },
  })
}
