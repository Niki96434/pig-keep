import { axiosInstance } from '@/shared/api'
import type { NotesGetOut } from '@shared/notes/types'
import { useQuery } from '@tanstack/react-query'

export const useGetNotesQuery = () => {
  const { data, status } = useQuery<NotesGetOut>({
    queryKey: ['notes'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/v1/notes')
      return res.data
    },
    placeholderData: { notes: [] },
  })

  return { data, status }
}
