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
    it.todo('should delete the note from the list', () => {})

    it.todo('should keep note in the list if deletion fails', () => {})
  })
})
