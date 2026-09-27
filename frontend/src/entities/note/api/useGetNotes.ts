import { api } from '@/shared/api'
import type { NotesGetOut } from '@shared/notes/types'
import { useQuery } from '@tanstack/react-query'

export const useGetNotesQuery = () => {
  const { data, status } = useQuery<NotesGetOut>({
    queryKey: ['notes'],
    queryFn: () => api.notes.getNotes(),
    placeholderData: { notes: [] },
  })

  return { data, status }
}
