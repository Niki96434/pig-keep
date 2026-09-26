import { waitFor } from '@testing-library/react'
import { server } from '@/shared/testing/msw/node'
import { http, HttpResponse } from 'msw'
import { renderHookWithProviders } from '@/shared/testing/test-utils'
import type { NotePutIn } from '@shared/notes/types'
import { useEditNoteMutation } from './useEditNoteMutation'

describe('edit note mutation', () => {
  const noteId = '01928d73-d8ed-7211-a314-7081d763271c'

  it('should return success if title and content are empty', async () => {
    const { result, queryClient } = renderHookWithProviders(useEditNoteMutation)

    const updateHandler = vi.fn()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    server.use(
      http.put<{ id: string }>(`*/api/v1/notes/:id`, async ({ params, request }) => {
        const body = (await request.json()) as NotePutIn
        updateHandler({ id: params.id, body })
        return HttpResponse.json({
          note: {
            id: params.id,
            user_id: '01928d73-d8ed-7211-a314-7081d763271a',
            title: body.title,
            content: body.content,
          },
        })
      })
    )

    result.current.mutate({ id: noteId, title: '', content: '' })

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy())
    expect(updateHandler).toHaveBeenCalledWith({
      id: noteId,
      body: { title: '', content: '' },
    })
    expect(invalidateSpy).toHaveBeenCalledTimes(1)
  })

  it('should return success if title and content are non-empty', async () => {
    const { result, queryClient } = renderHookWithProviders(useEditNoteMutation)

    const updateHandler = vi.fn()
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    server.use(
      http.put<{ id: string }>(`*/api/v1/notes/:id`, async ({ params, request }) => {
        const body = (await request.json()) as NotePutIn
        updateHandler({ id: params.id, body })
        return HttpResponse.json({
          note: {
            id: params.id,
            user_id: '01928d73-d8ed-7211-a314-7081d763271a',
            title: body.title,
            content: body.content,
          },
        })
      })
    )

    result.current.mutate({
      id: noteId,
      title: 'Новая заметка',
      content: 'Новое описание',
    })

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy())
    expect(updateHandler).toHaveBeenCalledWith({
      id: noteId,
      body: { title: 'Новая заметка', content: 'Новое описание' },
    })
    expect(invalidateSpy).toHaveBeenCalledTimes(1)
  })

  it('should return error if title or content exceeded the limits', async () => {
    const { result, queryClient } = renderHookWithProviders(useEditNoteMutation)
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    server.use(
      http.put<{ id: string }>(`*/api/v1/notes/:id`, async () => {
        return HttpResponse.json({ error: 'Validation error' }, { status: 400 })
      })
    )

    result.current.mutate({
      id: noteId,
      title: 'a'.repeat(256),
      content: 'b'.repeat(1001),
    })

    await waitFor(() => expect(result.current.isError).toBeTruthy())
    expect(invalidateSpy).not.toHaveBeenCalled()
  })

  it('should return error if id is invalid', async () => {
    const { result } = renderHookWithProviders(useEditNoteMutation)

    server.use(
      http.put<{ id: string }>(`*/api/v1/notes/:id`, async () => {
        return HttpResponse.json({ error: 'Validation error' }, { status: 400 })
      })
    )

    result.current.mutate({
      id: '12345',
      title: 'Заметка',
      content: 'Описание заметки',
    })

    await waitFor(() => expect(result.current.isError).toBeTruthy())
  })

  it('should return error if note is not found', async () => {
    const { result, queryClient } = renderHookWithProviders(useEditNoteMutation)
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    server.use(
      http.put<{ id: string }>(`*/api/v1/notes/:id`, async () => {
        return HttpResponse.json({ error: 'Not found' }, { status: 404 })
      })
    )

    result.current.mutate({
      id: noteId,
      title: 'Заметка',
      content: 'Описание заметки',
    })

    await waitFor(() => expect(result.current.isError).toBeTruthy())
    expect(invalidateSpy).not.toHaveBeenCalled()
  })
})
