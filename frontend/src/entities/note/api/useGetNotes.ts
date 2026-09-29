import { api } from '@/shared/api'
import type { NotesGetOut } from '@shared/notes/types'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@/features/fulltext-search/model/useDebounce'

export const useGetNotesQuery = (value?: string) => {
  const { search } = useDebounce(value)

  const { data, status } = useQuery<NotesGetOut>({
    queryKey: ['notes', search],
    queryFn: () => api.notes.getNotes(search),
    placeholderData: { notes: [] },
  })

  return { data, status }
}
