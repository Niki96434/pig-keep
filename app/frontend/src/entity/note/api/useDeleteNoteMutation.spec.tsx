import { waitFor } from '@testing-library/react'
import { server } from '@/shared/testing/msw/node'
import { http, HttpResponse } from 'msw'
import { renderHookWithProviders } from '@/shared/testing/test-utils'
import { useDeleteNoteMutation } from './useDeleteNoteMutation'

describe('deleting notes', () => {
  const noteId = '01928d73-d8ed-7211-a314-7081d763271c'

  it('should delete note and invalidate cache on success', async () => {
    const { result, queryClient } = renderHookWithProviders(useDeleteNoteMutation)

    const deleteHandler = vi.fn()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    server.use(
      http.delete<{ id?: string }>(`*/api/v1/notes/:id`, async ({ params }) => {
        deleteHandler(params.id)
        return HttpResponse.json({ message: 'Success' })
      })
    )
    result.current.mutate(noteId)

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy())
    expect(deleteHandler).toHaveBeenCalledWith(noteId)
    expect(invalidateSpy).toHaveBeenCalledTimes(1)
  })

  it('should handle mutation failure', async () => {
    const { result } = renderHookWithProviders(useDeleteNoteMutation)

    server.use(
      http.delete<{ id: string }>(`*/api/v1/notes/:id`, async () => {
        return HttpResponse.json({ error: 'server' }, { status: 500 })
      })
    )

    result.current.mutate(noteId)

    await waitFor(() => expect(result.current.isError).toBeTruthy())
  })
})
