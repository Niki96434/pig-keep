import { act, waitFor } from '@testing-library/react'
import { server } from '@/shared/testing/msw/node'
import { http, HttpResponse } from 'msw'
import { renderHookWithProviders } from '@/shared/testing/test-utils'
import { useNoteLogic } from './useNoteLogic'
import type React from 'react'

describe('useNoteLogic hook', () => {
  const noteId = '01928d73-d8ed-7211-a314-7081d763271c'
  const dummyEvent = { stopPropagation: () => {} } as React.MouseEvent

  describe('handleToggleArchive', () => {
    it('should archive active note by sending isArchive true', async () => {
      const patchSpy = vi.fn()

      server.use(
        http.patch<{ id: string }>('*/api/v1/notes/:id', async ({ params, request }) => {
          patchSpy({ id: params.id, body: await request.json() })
          return HttpResponse.json({ note: { id: params.id, isArchive: true } })
        })
      )

      const { result } = renderHookWithProviders(() =>
        useNoteLogic({ id: noteId, isArchive: false })
      )

      act(() => {
        result.current.handleToggleArchive(dummyEvent)
      })

      await waitFor(() => {
        expect(patchSpy).toHaveBeenCalledWith({
          id: noteId,
          body: { isArchive: true },
        })
      })
    })

    it('should unarchive archived note by sending isArchive false', async () => {
      const patchSpy = vi.fn()

      server.use(
        http.patch<{ id: string }>('*/api/v1/notes/:id', async ({ params, request }) => {
          patchSpy({ id: params.id, body: await request.json() })
          return HttpResponse.json({ note: { id: params.id, isArchive: false } })
        })
      )

      const { result } = renderHookWithProviders(() =>
        useNoteLogic({ id: noteId, isArchive: true })
      )

      act(() => {
        result.current.handleToggleArchive(dummyEvent)
      })

      await waitFor(() => {
        expect(patchSpy).toHaveBeenCalledWith({
          id: noteId,
          body: { isArchive: false },
        })
      })
    })
  })

  describe('handleToggleTag', () => {
    it('should send attach request when tag is not attached', async () => {
      const addTagSpy = vi.fn()

      server.use(
        http.post<{ id: string; tagId: string }>(
          '*/api/v1/notes/:id/tags/:tagId',
          ({ params }) => {
            addTagSpy({ noteId: params.id, tagId: params.tagId })
            return HttpResponse.json({ message: 'Success' })
          }
        )
      )

      const { result } = renderHookWithProviders(() =>
        useNoteLogic({ id: noteId, isArchive: false })
      )

      act(() => {
        result.current.handleToggleTag('tag-123', false)
      })

      await waitFor(() => {
        expect(addTagSpy).toHaveBeenCalledWith({
          noteId,
          tagId: 'tag-123',
        })
      })
    })

    it('should send detach request when tag is already attached', async () => {
      const removeTagSpy = vi.fn()

      server.use(
        http.delete<{ id: string; tagId: string }>(
          '*/api/v1/notes/:id/tags/:tagId',
          ({ params }) => {
            removeTagSpy({ noteId: params.id, tagId: params.tagId })
            return HttpResponse.json({ message: 'Success' })
          }
        )
      )

      const { result } = renderHookWithProviders(() =>
        useNoteLogic({ id: noteId, isArchive: false })
      )

      act(() => {
        result.current.handleToggleTag('tag-123', true)
      })

      await waitFor(() => {
        expect(removeTagSpy).toHaveBeenCalledWith({
          noteId,
          tagId: 'tag-123',
        })
      })
    })
  })

  describe('handleRemoveTag', () => {
    it('should send detach request for specified tag', async () => {
      const removeTagSpy = vi.fn()

      server.use(
        http.delete<{ id: string; tagId: string }>(
          '*/api/v1/notes/:id/tags/:tagId',
          ({ params }) => {
            removeTagSpy({ noteId: params.id, tagId: params.tagId })
            return HttpResponse.json({ message: 'Success' })
          }
        )
      )

      const { result } = renderHookWithProviders(() =>
        useNoteLogic({ id: noteId, isArchive: false })
      )

      act(() => {
        result.current.handleRemoveTag('tag-123', dummyEvent)
      })

      await waitFor(() => {
        expect(removeTagSpy).toHaveBeenCalledWith({
          noteId,
          tagId: 'tag-123',
        })
      })
    })
  })
})
