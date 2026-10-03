import { screen, waitFor } from '@testing-library/react'
import { server } from '@/shared/testing/msw/node'
import { http, HttpResponse } from 'msw'
import { renderWithProviders } from '@/shared/testing/test-utils'
import { useTagsModalStore } from '@/stores/manage-tags/tagsModalStore'
import { ManageTagsModal } from './ManageTagsModal'

describe('ManageTagsModal component', () => {
  beforeEach(() => {
    useTagsModalStore.setState({ isOpen: false })
  })

  it('should not render anything when modal is closed', () => {
    renderWithProviders(<ManageTagsModal />)
    expect(screen.queryByText('Создать / Изменить теги')).not.toBeInTheDocument()
  })

  it('should render modal content when opened', async () => {
    server.use(
      http.get('*/api/v1/tags', () => {
        return HttpResponse.json({
          tags: [
            { id: '1', name: 'Работа' },
            { id: '2', name: 'Учеба' },
          ],
        })
      })
    )

    useTagsModalStore.getState().open()
    renderWithProviders(<ManageTagsModal />)

    expect(screen.getByText('Создать / Изменить теги')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Новый тег...')).toBeInTheDocument()
    expect(await screen.findByText('Работа')).toBeInTheDocument()
    expect(screen.getByText('Учеба')).toBeInTheDocument()
  })

  it('should create tag on form submit and clear input', async () => {
    const createHandler = vi.fn()
    server.use(
      http.get('*/api/v1/tags', () => {
        return HttpResponse.json({ tags: [] })
      }),
      http.post('*/api/v1/tags', async ({ request }) => {
        const body = (await request.json()) as { name: string }
        createHandler(body)
        return HttpResponse.json({ tag: { id: '3', name: body.name } })
      })
    )

    useTagsModalStore.getState().open()
    const { user } = renderWithProviders(<ManageTagsModal />)

    const input = screen.getByPlaceholderText('Новый тег...')
    await user.type(input, 'Новый тег')
    expect(input).toHaveValue('Новый тег')

    const createButton = screen.getByRole('button', { name: /создать тег/i })
    await user.click(createButton)

    await waitFor(() => expect(createHandler).toHaveBeenCalledWith({ name: 'Новый тег' }))
    await waitFor(() => expect(input).toHaveValue(''))
  })

  it('should create tag and close modal when clicking Done with non-empty input', async () => {
    const createHandler = vi.fn()
    server.use(
      http.get('*/api/v1/tags', () => {
        return HttpResponse.json({ tags: [] })
      }),
      http.post('*/api/v1/tags', async ({ request }) => {
        const body = (await request.json()) as { name: string }
        createHandler(body)
        return HttpResponse.json({ tag: { id: '4', name: body.name } })
      })
    )

    useTagsModalStore.getState().open()
    const { user } = renderWithProviders(<ManageTagsModal />)

    const input = screen.getByPlaceholderText('Новый тег...')
    await user.type(input, 'Тег при выходе')

    const doneButton = screen.getByRole('button', { name: /готово/i })
    await user.click(doneButton)

    await waitFor(() => expect(createHandler).toHaveBeenCalledWith({ name: 'Тег при выходе' }))
    await waitFor(() => {
      expect(screen.queryByText('Создать / Изменить теги')).not.toBeInTheDocument()
    })
  })

  it('should delete tag when clicking delete button', async () => {
    const deleteHandler = vi.fn()
    server.use(
      http.get('*/api/v1/tags', () => {
        return HttpResponse.json({
          tags: [{ id: 'tag-1', name: 'Удаляемый тег' }],
        })
      }),
      http.delete('*/api/v1/tags/:id', ({ params }) => {
        deleteHandler(params.id)
        return HttpResponse.json({ message: 'Success' })
      })
    )

    useTagsModalStore.getState().open()
    const { user } = renderWithProviders(<ManageTagsModal />)

    expect(await screen.findByText('Удаляемый тег')).toBeInTheDocument()

    const deleteButton = screen.getByRole('button', { name: /удалить тег удаляемый тег/i })
    await user.click(deleteButton)

    await waitFor(() => expect(deleteHandler).toHaveBeenCalledWith('tag-1'))
  })

  it('should edit tag when clicking edit button, changing name, and clicking save', async () => {
    const updateHandler = vi.fn()
    server.use(
      http.get('*/api/v1/tags', () => {
        return HttpResponse.json({
          tags: [{ id: 'tag-1', name: 'Старое имя' }],
        })
      }),
      http.put('*/api/v1/tags/:id', async ({ params, request }) => {
        const body = (await request.json()) as { name: string }
        updateHandler({ id: params.id, body })
        return HttpResponse.json({ tag: { id: params.id, name: body.name } })
      })
    )

    useTagsModalStore.getState().open()
    const { user } = renderWithProviders(<ManageTagsModal />)

    expect(await screen.findByText('Старое имя')).toBeInTheDocument()

    const editButton = screen.getByRole('button', { name: /редактировать тег старое имя/i })
    await user.click(editButton)

    const editInput = screen.getByRole('textbox', { name: /редактировать название тега/i })
    expect(editInput).toHaveValue('Старое имя')

    await user.clear(editInput)
    await user.type(editInput, 'Новое имя')

    const saveButton = screen.getByRole('button', { name: /сохранить тег/i })
    await user.click(saveButton)

    await waitFor(() =>
      expect(updateHandler).toHaveBeenCalledWith({
        id: 'tag-1',
        body: { name: 'Новое имя' },
      })
    )
  })

  it('should cancel editing when clicking cancel button', async () => {
    server.use(
      http.get('*/api/v1/tags', () => {
        return HttpResponse.json({
          tags: [{ id: 'tag-1', name: 'Старое имя' }],
        })
      })
    )

    useTagsModalStore.getState().open()
    const { user } = renderWithProviders(<ManageTagsModal />)

    expect(await screen.findByText('Старое имя')).toBeInTheDocument()

    const editButton = screen.getByRole('button', { name: /редактировать тег старое имя/i })
    await user.click(editButton)

    const editInput = screen.getByRole('textbox', { name: /редактировать название тега/i })
    expect(editInput).toBeInTheDocument()

    const cancelButton = screen.getByRole('button', { name: /отменить редактирование/i })
    await user.click(cancelButton)

    expect(screen.queryByRole('textbox', { name: /редактировать название тега/i })).not.toBeInTheDocument()
    expect(screen.getByText('Старое имя')).toBeInTheDocument()
  })
})

