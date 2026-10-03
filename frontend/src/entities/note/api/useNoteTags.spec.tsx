import { waitFor } from '@testing-library/react'
import { server } from '@/shared/testing/msw/node'
import { http, HttpResponse } from 'msw'
import { renderHookWithProviders } from '@/shared/testing/test-utils'
import {
  useGetNoteTagsQuery,
  useAddTagToNoteMutation,
  useRemoveTagFromNoteMutation,
} from './useNoteTags'

describe('useNoteTags', () => {
  const noteId = '01928d73-d8ed-7211-a314-7081d763271c'
  const tagId = '01928d73-d8ed-7211-a314-7081d763271d'
  const mockTags = [{ id: tagId, name: 'Срочно', user_id: 'user-1' }]

  it('should fetch note tags', async () => {
    server.use(
      http.get('*/api/v1/notes/:id/tags', () => {
        return HttpResponse.json({ tags: mockTags })
      })
    )

    const { result } = renderHookWithProviders(() => useGetNoteTagsQuery(noteId))

    await waitFor(() => expect(result.current.data?.tags).toEqual(mockTags))
  })

  it('should add tag to note and invalidate queries', async () => {
    let added = false
    const { result, queryClient } = renderHookWithProviders(useAddTagToNoteMutation)
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    server.use(
      http.post('*/api/v1/notes/:id/tags/:tagId', () => {
        added = true
        return HttpResponse.json({ message: 'Success' })
      })
    )

    result.current.mutate({ noteId, tagId })

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy())
    expect(added).toBe(true)
    expect(invalidateSpy).toHaveBeenCalled()
  })

  it('should remove tag from note and invalidate queries', async () => {
    let removed = false
    const { result, queryClient } = renderHookWithProviders(useRemoveTagFromNoteMutation)
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    server.use(
      http.delete('*/api/v1/notes/:id/tags/:tagId', () => {
        removed = true
        return HttpResponse.json({ message: 'Success' })
      })
    )

    result.current.mutate({ noteId, tagId })

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy())
    expect(removed).toBe(true)
    expect(invalidateSpy).toHaveBeenCalled()
  })
})
