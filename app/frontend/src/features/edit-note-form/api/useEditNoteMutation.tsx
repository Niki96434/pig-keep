import { axiosInstance } from '@/shared/api'
import type { NoteUpdateIn, NotePutIn } from '@shared/notes/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useEditNoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, title, content }: NoteUpdateIn) => {
      const res = await axiosInstance.put<NotePutIn>(`/api/v1/notes/${id}`, { title, content })
      return res.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  })
}
