import { useMutation } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import type { NoteCreateIn, NoteCreateOut } from '@shared/notes/types'
import { queryClient } from '@/shared/api'

export function useCreateNoteMutation() {
  const mutation = useMutation({
    mutationFn: async ({ title, content }: NoteCreateIn) => {
      const res = await axiosInstance.post<NoteCreateOut>('/api/v1/notes', { title, content })
      return res.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  })

  return mutation
}
