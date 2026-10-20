import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'

export const useGetNoteTagsQuery = (noteId: string) => {
  return useQuery({
    queryKey: ['notes', noteId, 'tags'],
    queryFn: async ({ signal }) => {
      const res = await apiClient.GET('/api/v1/notes/{id}/tags', {
        signal,
        params: { path: { id: noteId } },
      })
      if (res.error) throw res.error
      return res.data
    },
  })
}

export const useAddTagToNoteMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ noteId, tagId }: { noteId: string; tagId: string }) => {
      const res = await apiClient.POST('/api/v1/notes/{id}/tags/{tagId}', {
        params: { path: { id: noteId, tagId } },
      })
      if (res.error) throw res.error
      return res.data
    },
    onSuccess: (_, { noteId }) => {
      queryClient.invalidateQueries({ queryKey: ['notes', noteId, 'tags'] })
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

export const useRemoveTagFromNoteMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ noteId, tagId }: { noteId: string; tagId: string }) => {
      const res = await apiClient.DELETE('/api/v1/notes/{id}/tags/{tagId}', {
        params: { path: { id: noteId, tagId } },
      })
      if (res.error) throw res.error
      return res.data
    },
    onSuccess: (_, { noteId }) => {
      queryClient.invalidateQueries({ queryKey: ['notes', noteId, 'tags'] })
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}
