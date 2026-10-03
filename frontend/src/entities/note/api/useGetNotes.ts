import { api } from '@/shared/api'
import type { NotesGetOut } from '@shared/notes/types'
import { useQuery } from '@tanstack/react-query'

export interface NoteFilters {
  searchValue?: string
  tagId?: string
  isArchived?: boolean
  isDeleted?: boolean
}

export const useGetNotesQuery = (filters?: NoteFilters) => {
  return useQuery<NotesGetOut>({
    queryKey: ['notes', { search: filters?.searchValue, tagId: filters?.tagId }],
    queryFn: () =>
      api.notes.getNotes({
        search: filters?.searchValue,
        tagId: filters?.tagId,
      }),
    placeholderData: { notes: [] },
  })
}
