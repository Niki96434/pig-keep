import { NoteList } from './NoteList'
import { screen, waitFor } from '@testing-library/react'
import { server } from '@/shared/testing/msw/node'
import { HttpResponse, http } from 'msw'
import { renderWithProviders } from '@/shared/testing/test-utils'

describe('NoteList', () => {
  it('should display error message on server error', async () => {
    server.use(
      http.get('*/api/v1/notes', () => {
        return HttpResponse.json(null, { status: 500 })
      })
    )
    renderWithProviders(<NoteList />)

    const errorMessage = await screen.findByText(/ошибка загрузки/i)
    await waitFor(() => expect(errorMessage).toBeInTheDocument())
  })

  it('should render list of notes on successful response', async () => {
    renderWithProviders(<NoteList />)

    const notes = await screen.findAllByText(/заметка/i)
    expect(notes).toHaveLength(3)
  })

  it('should not render any notes when list is empty', async () => {
    server.use(
      http.get('*/api/v1/notes', () => {
        return HttpResponse.json({ notes: [] })
      })
    )

    renderWithProviders(<NoteList />)

    await waitFor(() => {
      expect(screen.queryByText(/заметка/i)).not.toBeInTheDocument()
    })
  })

  describe('note deletion', () => {
    it('should delete the note from the list', async () => {
      let currentNotes = [
        {
          id: '01928d73-d8ed-7211-a314-7081d763271c',
          user_id: '123-1201928d73-d8ed-7211-a314-7081d763271d',
          title: 'Заметка 1',
          content: 'Содержимое первой заметки',
        },
        {
          id: '01928d73-d8ed-7211-a314-7081d763271b',
          user_id: '12345-28d73-d8ed-7211-a314-7081d763271d',
          title: 'Заметка 2',
          content: 'Содержимое второй заметки',
        },
      ]

      server.use(
        http.get('*/api/v1/notes', () => {
          return HttpResponse.json({ notes: currentNotes })
        }),
        http.delete<{ id: string }>('*/api/v1/notes/:id', ({ params }) => {
          currentNotes = currentNotes.filter((note) => note.id !== params.id)
          return HttpResponse.json({ message: 'Success' })
        })
      )

      const { user } = renderWithProviders(<NoteList />)

      const initialNotes = await screen.findAllByText(/заметка/i)
      expect(initialNotes).toHaveLength(2)

      const menuButtons = await screen.findAllByRole('button')
      await user.click(menuButtons[0])

      const deleteButton = await screen.findByRole('menuitem', { name: /удалить/i })
      await user.click(deleteButton)

      await waitFor(() => {
        expect(screen.queryByText('Заметка 1')).not.toBeInTheDocument()
      })
      expect(screen.getByText('Заметка 2')).toBeInTheDocument()
    })

    it('should keep note in the list if deletion fails', async () => {
      server.use(
        http.delete('*/api/v1/notes/:id', () => {
          return HttpResponse.json({ error: 'Server error' }, { status: 500 })
        })
      )

      const { user } = renderWithProviders(<NoteList />)

      const notes = await screen.findAllByText(/заметка/i)
      expect(notes).toHaveLength(3)

      const menuButtons = await screen.findAllByRole('button')
      await user.click(menuButtons[0])

      const deleteButton = await screen.findByRole('menuitem', { name: /удалить/i })
      await user.click(deleteButton)

      await waitFor(() => {
        expect(screen.getByText('Заметка 1')).toBeInTheDocument()
      })
    })
  })
})
