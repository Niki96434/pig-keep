import { screen, waitFor, fireEvent } from '@testing-library/react'
import { server } from '@/shared/testing/msw/node'
import { HttpResponse, http } from 'msw'
import { renderWithProviders } from '@/shared/testing/test-utils'
import { Note } from './Note'

describe('Note component', () => {
  const noteId = '01928d73-d8ed-7211-a314-7081d763271c'
  const mockTags = [
    { id: 'tag-1', name: 'Работа', user_id: 'user-1' },
    { id: 'tag-2', name: 'Дом', user_id: 'user-1' },
  ]

  beforeEach(() => {
    server.use(
      http.get('*/api/v1/tags', () => {
        return HttpResponse.json({ tags: mockTags })
      }),
      http.get('*/api/v1/notes/:id/tags', () => {
        return HttpResponse.json({ tags: [mockTags[0]] })
      })
    )
  })

  it('should render title, content, and attached tags', async () => {
    renderWithProviders(<Note id={noteId} title="Тестовый заголовок" content="Тестовый контент" />)

    expect(screen.getByText('Тестовый заголовок')).toBeInTheDocument()
    expect(screen.getByText('Тестовый контент')).toBeInTheDocument()

    const tagBadge = await screen.findByText('Работа')
    expect(tagBadge).toBeInTheDocument()
  })

  it('should remove tag when clicking delete button on TagBadge', async () => {
    let removed = false
    server.use(
      http.delete('*/api/v1/notes/:id/tags/:tagId', () => {
        removed = true
        return HttpResponse.json({ message: 'Success' })
      })
    )

    const { user } = renderWithProviders(
      <Note id={noteId} title="Тестовый заголовок" content="Тестовый контент" />
    )

    const deleteTagBtn = await screen.findByRole('button', { name: /удалить тег работа/i })
    await user.click(deleteTagBtn)

    await waitFor(() => {
      expect(removed).toBe(true)
    })
  })

  it('should toggle tag attachment from dropdown menu', async () => {
    let addedTagId = ''
    server.use(
      http.post<{ id: string; tagId: string }>('*/api/v1/notes/:id/tags/:tagId', ({ params }) => {
        addedTagId = params.tagId
        return HttpResponse.json({ message: 'Success' })
      })
    )

    const { user } = renderWithProviders(
      <Note id={noteId} title="Тестовый заголовок" content="Тестовый контент" />
    )

    const menuBtn = screen.getByRole('button', { name: /меню заметки/i })
    await user.click(menuBtn)

    const addTagSubTrigger = await screen.findByText('Добавить тег')
    expect(addTagSubTrigger).toBeInTheDocument()
    fireEvent.click(addTagSubTrigger)

    const secondTagItem = await screen.findByText('Дом')
    expect(secondTagItem).toBeInTheDocument()
    fireEvent.click(secondTagItem)

    await waitFor(() => {
      expect(addedTagId).toBe('tag-2')
    })
  })

  it('should toggle archive state when clicking archive button', async () => {
    let patchedData: unknown = null
    server.use(
      http.patch<{ id: string }>(`*/api/v1/notes/:id`, async ({ request }) => {
        patchedData = await request.json()
        return HttpResponse.json({ note: { id: noteId, isArchive: true } })
      })
    )

    const { user } = renderWithProviders(
      <Note id={noteId} title="Тестовый заголовок" content="Тестовый контент" isArchive={false} />
    )

    const archiveBtn = screen.getByRole('button', { name: /архивировать/i })
    await user.click(archiveBtn)

    await waitFor(() => {
      expect(patchedData).toEqual({ isArchive: true })
    })
  })

  it('should restore note when clicking restore button on deleted note', async () => {
    let patchedData: unknown = null
    server.use(
      http.patch<{ id: string }>(`*/api/v1/notes/:id`, async ({ request }) => {
        patchedData = await request.json()
        return HttpResponse.json({ note: { id: noteId, isDeleted: false } })
      })
    )

    const { user } = renderWithProviders(
      <Note id={noteId} title="Тестовый заголовок" content="Тестовый контент" isDeleted={true} />
    )

    const restoreBtn = screen.getByRole('button', { name: /восстановить/i })
    await user.click(restoreBtn)

    await waitFor(() => {
      expect(patchedData).toEqual({ isDeleted: false })
    })
  })

  it('should permanently delete note when clicking delete forever button on deleted note', async () => {
    let deleted = false
    server.use(
      http.delete<{ id: string }>(`*/api/v1/notes/:id`, () => {
        deleted = true
        return HttpResponse.json({ message: 'Success' })
      })
    )

    const { user } = renderWithProviders(
      <Note id={noteId} title="Тестовый заголовок" content="Тестовый контент" isDeleted={true} />
    )

    const permanentDeleteBtn = screen.getByRole('button', { name: /удалить навсегда/i })
    await user.click(permanentDeleteBtn)

    await waitFor(() => {
      expect(deleted).toBe(true)
    })
  })
})

