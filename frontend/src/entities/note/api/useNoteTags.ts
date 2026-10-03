import { api } from '@/shared/api'
import type { Tag } from '@shared/tags/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetNoteTagsQuery = (noteId: string) => {
  return useQuery<{ tags: Tag[] }>({
    queryKey: ['notes', noteId, 'tags'],
    queryFn: () => api.notes.getNoteTags(noteId),
  })
}

export const useAddTagToNoteMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ noteId, tagId }: { noteId: string; tagId: string }) =>
      api.notes.addTagToNote(noteId, tagId),
    onSuccess: (_, { noteId }) => {
      queryClient.invalidateQueries({ queryKey: ['notes', noteId, 'tags'] })
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export const useRemoveTagFromNoteMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ noteId, tagId }: { noteId: string; tagId: string }) =>
      api.notes.removeTagFromNote(noteId, tagId),
    onSuccess: (_, { noteId }) => {
      queryClient.invalidateQueries({ queryKey: ['notes', noteId, 'tags'] })
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}
