import { screen, waitFor } from '@testing-library/react'
import SearchInput from './SearchInput'
import { NoteList } from '@/entities/note/ui/NoteList'
import { renderWithProviders } from '@/shared/testing/test-utils'
import { useSearchStore } from '@/stores/fulltext-search/searchStore'
import { server } from '@/shared/testing/msw/node'
import { http, HttpResponse } from 'msw'
import { notes as mockNotes } from '@/shared/testing/msw/mockData'
import { vi } from 'vitest'

describe('SearchInput integration tests', () => {
  beforeEach(() => {
    useSearchStore.setState({ value: null })
  })

  afterEach(() => {
    useSearchStore.setState({ value: null })
  })

  describe('UI interaction', () => {
    it('should render search input with placeholder and without clear button initially', () => {
      renderWithProviders(<SearchInput />)

      const input = screen.getByPlaceholderText(/поиск/i)
      expect(input).toBeInTheDocument()
      expect(input).toHaveValue('')

      const clearButton = screen.queryByRole('button', { name: /очистить/i })
      expect(clearButton).not.toBeInTheDocument()
    })

    it('should update input value and show clear button when user types text', async () => {
      const { user } = renderWithProviders(<SearchInput />)

      const input = screen.getByPlaceholderText(/поиск/i)
      await user.type(input, 'купить хлеб')

      expect(input).toHaveValue('купить хлеб')

      const clearButton = screen.getByRole('button', { name: /очистить/i })
      expect(clearButton).toBeInTheDocument()
    })

    it('should clear input and hide clear button on click', async () => {
      const { user } = renderWithProviders(<SearchInput />)

      const input = screen.getByPlaceholderText(/поиск/i)
      await user.type(input, 'текст для поиска')

      expect(input).toHaveValue('текст для поиска')

      const clearButton = screen.getByRole('button', { name: /очистить/i })
      await user.click(clearButton)

      expect(input).toHaveValue('')
      expect(screen.queryByRole('button', { name: /очистить/i })).not.toBeInTheDocument()
    })
  })

  describe('SearchInput and NoteList', () => {
    const Component = () => (
      <div>
        <SearchInput />
        <NoteList />
      </div>
    )

    it('should trigger search request with search query parameter and filter notes in NoteList', async () => {
      const requestSpy = vi.fn()

      server.use(
        http.get('*/api/v1/notes', ({ request }) => {
          const url = new URL(request.url)
          const search = url.searchParams.get('search')
          requestSpy(search)

          if (search) {
            const filtered = mockNotes.filter(
              (note) =>
                note.title.toLowerCase().includes(search.toLowerCase()) ||
                note.content.toLowerCase().includes(search.toLowerCase())
            )
            return HttpResponse.json({ notes: filtered })
          }

          return HttpResponse.json({ notes: mockNotes })
        })
      )

      const { user } = renderWithProviders(<Component />)

      expect(await screen.findByText('Заметка 1')).toBeInTheDocument()
      expect(screen.getByText('Заметка 2')).toBeInTheDocument()
      expect(screen.getByText('Заметка 3')).toBeInTheDocument()

      const searchInput = screen.getByPlaceholderText(/поиск/i)
      await user.type(searchInput, 'Заметка 1')

      await waitFor(() => {
        expect(screen.getByText('Заметка 1')).toBeInTheDocument()
        expect(screen.queryByText('Заметка 2')).not.toBeInTheDocument()
        expect(screen.queryByText('Заметка 3')).not.toBeInTheDocument()
      })

      expect(requestSpy).toHaveBeenCalledWith('Заметка 1')
    })
  })
})
