import { renderHook, waitFor } from '@testing-library/react'
import { useDeleteNoteMutation } from './useDeleteNoteMutation'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type React from 'react'
import { server } from '@/shared/testing/msw/node'
import { http, HttpResponse } from 'msw'

function renderHookWithProviders() {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
  }

  return renderHook(() => useDeleteNoteMutation(), { wrapper })
}

describe('deleting notes', () => {
  const noteId = '01928d73-d8ed-7211-a314-7081d763272c'

  it('should call DELETE /api/v1/notes/:id with the provided noteId', async () => {
    const { result } = renderHookWithProviders()
    let id: string | undefined
    server.use(
      http.delete<{ id?: string }>(`*/api/v1/notes/:id`, async ({ params }) => {
        id = params.id as string
        return HttpResponse.json({ message: 'Success' })
      })
    )
    result.current.mutate(noteId)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    await waitFor(() => expect(id).toBe(noteId))
  })

  it.todo('should invalidate ["notes"] query on success', () => {})

  it.todo('should handle mutation failure', () => {})
})
