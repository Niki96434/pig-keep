import { waitFor } from '@testing-library/react'
import { server } from '@/shared/testing/msw/node'
import { http, HttpResponse } from 'msw'
import { renderHookWithProviders } from '@/shared/testing/test-utils'
import type { NoteCreateIn } from '@shared/notes/types'
import { useCreateNoteMutation } from './useCreateNoteMutation'

describe('create note mutation', () => {
  it('should create note and invalidate cache on success', async () => {
    const { result, queryClient } = renderHookWithProviders(useCreateNoteMutation)

    const createHandler = vi.fn()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    server.use(
      http.post('*/api/v1/notes', async ({ request }) => {
        const body = (await request.json()) as NoteCreateIn
        createHandler(body)
        return HttpResponse.json({
          note: {
            id: '01928d73-d8ed-7211-a314-7081d763282b',
            user_id: '01928d73-d8ed-7211-a314-7081d763271a',
            title: body.title,
            content: body.content,
          },
        })
      })
    )

    result.current.mutate({ title: 'Тестовая заметка', content: 'Тестовое описание' })

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy())
    expect(createHandler).toHaveBeenCalledWith({
      title: 'Тестовая заметка',
      content: 'Тестовое описание',
    })
    expect(invalidateSpy).toHaveBeenCalledTimes(1)
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['notes'] })
  })

  it('should handle mutation failure and not invalidate cache', async () => {
    const { result, queryClient } = renderHookWithProviders(useCreateNoteMutation)
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    server.use(
      http.post('*/api/v1/notes', () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 })
      })
    )

    result.current.mutate({ title: 'Тестовая заметка', content: 'Тестовое описание' })

    await waitFor(() => expect(result.current.isError).toBeTruthy())
    expect(invalidateSpy).not.toHaveBeenCalled()
  })
})
