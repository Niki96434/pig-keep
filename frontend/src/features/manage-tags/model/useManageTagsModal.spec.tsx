import { act, waitFor } from '@testing-library/react'
import { server } from '@/shared/testing/msw/node'
import { http, HttpResponse } from 'msw'
import { renderHookWithProviders } from '@/shared/testing/test-utils'
import { useTagsModalStore } from '@/stores/manage-tags/tagsModalStore'
import { useManageTagsModal } from './useManageTagsModal'

describe('useManageTagsModal hook', () => {
  beforeEach(() => {
    act(() => {
      useTagsModalStore.setState({ isOpen: false })
    })
  })

  it('should reflect open state from tagsModalStore', () => {
    const { result } = renderHookWithProviders(useManageTagsModal)
    expect(result.current.isOpen).toBe(false)

    act(() => {
      useTagsModalStore.getState().open()
    })

    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.close()
    })

    expect(result.current.isOpen).toBe(false)
  })

  it('should create a tag and reset tagName on handleCreate', async () => {
    const createHandler = vi.fn()
    server.use(
      http.post('*/api/v1/tags', async ({ request }) => {
        const body = (await request.json()) as { name: string }
        createHandler(body)
        return HttpResponse.json({
          tag: {
            id: '01928d73-d8ed-7211-a314-7081d763282b',
            name: body.name,
          },
        })
      })
    )

    const { result } = renderHookWithProviders(useManageTagsModal)

    act(() => {
      result.current.setTagName('Новый тег')
    })

    expect(result.current.tagName).toBe('Новый тег')

    act(() => {
      result.current.handleCreate()
    })

    await waitFor(() => expect(createHandler).toHaveBeenCalledWith({ name: 'Новый тег' }))
    await waitFor(() => expect(result.current.tagName).toBe(''))
  })

  it('should not call mutation on handleCreate if tagName is empty or only spaces', () => {
    const createHandler = vi.fn()
    server.use(
      http.post('*/api/v1/tags', async ({ request }) => {
        const body = (await request.json()) as { name: string }
        createHandler(body)
        return HttpResponse.json({ tag: { id: '1', name: body.name } })
      })
    )

    const { result } = renderHookWithProviders(useManageTagsModal)

    act(() => {
      result.current.setTagName('   ')
    })

    act(() => {
      result.current.handleCreate()
    })

    expect(createHandler).not.toHaveBeenCalled()
  })

  it('should create tag and close modal when handleDone is called with non-empty tagName', async () => {
    const createHandler = vi.fn()
    server.use(
      http.post('*/api/v1/tags', async ({ request }) => {
        const body = (await request.json()) as { name: string }
        createHandler(body)
        return HttpResponse.json({
          tag: {
            id: '01928d73-d8ed-7211-a314-7081d763282b',
            name: body.name,
          },
        })
      })
    )

    act(() => {
      useTagsModalStore.getState().open()
    })

    const { result } = renderHookWithProviders(useManageTagsModal)
    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.setTagName('Тег из Готово')
    })

    act(() => {
      result.current.handleDone()
    })

    await waitFor(() => expect(createHandler).toHaveBeenCalledWith({ name: 'Тег из Готово' }))
    await waitFor(() => expect(result.current.isOpen).toBe(false))
  })

  it('should simply close modal when handleDone is called with empty tagName', () => {
    const createHandler = vi.fn()
    server.use(
      http.post('*/api/v1/tags', async ({ request }) => {
        const body = (await request.json()) as { name: string }
        createHandler(body)
        return HttpResponse.json({ tag: { id: '1', name: body.name } })
      })
    )

    act(() => {
      useTagsModalStore.getState().open()
    })

    const { result } = renderHookWithProviders(useManageTagsModal)
    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.handleDone()
    })

    expect(createHandler).not.toHaveBeenCalled()
    expect(result.current.isOpen).toBe(false)
  })

  it('should call delete mutation when handleDelete is called', async () => {
    const deleteHandler = vi.fn()
    server.use(
      http.delete('*/api/v1/tags/:id', ({ params }) => {
        deleteHandler(params.id)
        return HttpResponse.json({ message: 'Success' })
      })
    )

    const { result } = renderHookWithProviders(useManageTagsModal)

    act(() => {
      result.current.handleDelete('tag-id-123')
    })

    await waitFor(() => expect(deleteHandler).toHaveBeenCalledWith('tag-id-123'))
  })

  it('should start, cancel, and save edit properly', async () => {
    const updateHandler = vi.fn()
    server.use(
      http.get('*/api/v1/tags', () => {
        return HttpResponse.json({
          tags: [{ id: 'tag-1', name: 'Старый тег' }],
        })
      }),
      http.put('*/api/v1/tags/:id', async ({ params, request }) => {
        const body = (await request.json()) as { name: string }
        updateHandler({ id: params.id, body })
        return HttpResponse.json({
          tag: { id: params.id, name: body.name },
        })
      })
    )

    const { result } = renderHookWithProviders(useManageTagsModal)

    await waitFor(() => expect(result.current.tags).toHaveLength(1))

    act(() => {
      result.current.handleStartEdit({ id: 'tag-1', name: 'Старый тег' })
    })

    expect(result.current.editingTagId).toBe('tag-1')
    expect(result.current.editingTagName).toBe('Старый тег')

    act(() => {
      result.current.setEditingTagName('Обновленный тег')
    })

    act(() => {
      result.current.handleSaveEdit('tag-1')
    })

    await waitFor(() =>
      expect(updateHandler).toHaveBeenCalledWith({
        id: 'tag-1',
        body: { name: 'Обновленный тег' },
      })
    )

    await waitFor(() => {
      expect(result.current.editingTagId).toBeNull()
      expect(result.current.editingTagName).toBe('')
    })
  })

  it('should not call update mutation if tag name has not changed', async () => {
    const updateHandler = vi.fn()
    server.use(
      http.get('*/api/v1/tags', () => {
        return HttpResponse.json({
          tags: [{ id: 'tag-1', name: 'Старый тег' }],
        })
      }),
      http.put('*/api/v1/tags/:id', async ({ params, request }) => {
        const body = (await request.json()) as { name: string }
        updateHandler({ id: params.id, body })
        return HttpResponse.json({
          tag: { id: params.id, name: body.name },
        })
      })
    )

    const { result } = renderHookWithProviders(useManageTagsModal)

    await waitFor(() => expect(result.current.tags).toHaveLength(1))

    act(() => {
      result.current.handleStartEdit({ id: 'tag-1', name: 'Старый тег' })
    })

    act(() => {
      result.current.handleSaveEdit('tag-1')
    })

    expect(updateHandler).not.toHaveBeenCalled()
    expect(result.current.editingTagId).toBeNull()
  })
})

