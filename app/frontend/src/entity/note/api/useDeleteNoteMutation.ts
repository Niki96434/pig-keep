import { axiosInstance } from '@/shared/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Note } from '@shared/notes/types'

export function useDeleteNoteMutation() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (noteId: Note['id']): Promise<void> => {
      return axiosInstance.delete(`/api/v1/notes/${noteId}`)
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ['notes'] }),
  })
}
