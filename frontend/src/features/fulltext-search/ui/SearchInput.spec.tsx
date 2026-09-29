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

  describe('UI & search store interaction', () => {
    it('should render search input with placeholder and without clear button initially', () => {
      renderWithProviders(<SearchInput />)

      const input = screen.getByPlaceholderText(/поиск/i)
      expect(input).toBeInTheDocument()
      expect(input).toHaveValue('')

      const clearButton = screen.queryByRole('button', { name: /очистить/i })
      expect(clearButton).not.toBeInTheDocument()
    })

    it('should update input value and store when user types text', async () => {
      const { user } = renderWithProviders(<SearchInput />)

      const input = screen.getByPlaceholderText(/поиск/i)
      await user.type(input, 'купить хлеб')

      expect(input).toHaveValue('купить хлеб')
      expect(useSearchStore.getState().value).toBe('купить хлеб')

      const clearButton = screen.getByRole('button', { name: /очистить/i })
      expect(clearButton).toBeInTheDocument()
    })

    it('should clear input, reset store to null, and hide clear button on click', async () => {
      const { user } = renderWithProviders(<SearchInput />)

      const input = screen.getByPlaceholderText(/поиск/i)
      await user.type(input, 'текст для поиска')

      expect(input).toHaveValue('текст для поиска')
      expect(useSearchStore.getState().value).toBe('текст для поиска')

      const clearButton = screen.getByRole('button', { name: /очистить/i })
      await user.click(clearButton)

      expect(input).toHaveValue('')
      expect(useSearchStore.getState().value).toBeNull()
      expect(screen.queryByRole('button', { name: /очистить/i })).not.toBeInTheDocument()
    })

    it('should synchronize input value and render clear button when store is initialized with a value', () => {
      useSearchStore.setState({ value: 'существующий запрос' })

      renderWithProviders(<SearchInput />)

      const input = screen.getByPlaceholderText(/поиск/i)
      expect(input).toHaveValue('существующий запрос')

      const clearButton = screen.getByRole('button', { name: /очистить/i })
      expect(clearButton).toBeInTheDocument()
    })

    it('should update store when user clears text manually with Backspace', async () => {
      const { user } = renderWithProviders(<SearchInput />)

      const input = screen.getByPlaceholderText(/поиск/i)
      await user.type(input, 'тест')
      expect(useSearchStore.getState().value).toBe('тест')

      await user.clear(input)
      expect(input).toHaveValue('')
      expect(useSearchStore.getState().value).toBe('')
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

    it('should restore all notes when clear button is clicked after searching', async () => {
      server.use(
        http.get('*/api/v1/notes', ({ request }) => {
          const url = new URL(request.url)
          const search = url.searchParams.get('search')

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

      const searchInput = screen.getByPlaceholderText(/поиск/i)
      await user.type(searchInput, 'Заметка 2')

      await waitFor(() => {
        expect(screen.getByText('Заметка 2')).toBeInTheDocument()
        expect(screen.queryByText('Заметка 1')).not.toBeInTheDocument()
        expect(screen.queryByText('Заметка 3')).not.toBeInTheDocument()
      })

      const clearButton = screen.getByRole('button', { name: /очистить/i })
      await user.click(clearButton)

      await waitFor(() => {
        expect(screen.getByText('Заметка 1')).toBeInTheDocument()
        expect(screen.getByText('Заметка 2')).toBeInTheDocument()
        expect(screen.getByText('Заметка 3')).toBeInTheDocument()
      })
    })

    it('should handle case-insensitive search and find notes by content', async () => {
      server.use(
        http.get('*/api/v1/notes', ({ request }) => {
          const url = new URL(request.url)
          const search = url.searchParams.get('search')

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

      const searchInput = screen.getByPlaceholderText(/поиск/i)
      await user.type(searchInput, 'Заметка 1')

      await waitFor(() => {
        expect(screen.getByText('Заметка 1')).toBeInTheDocument()
        expect(screen.queryByText('Заметка 2')).not.toBeInTheDocument()
        expect(screen.queryByText('Заметка 3')).not.toBeInTheDocument()
      })
    })

    it('should handle empty search results when no notes match the query', async () => {
      server.use(
        http.get('*/api/v1/notes', ({ request }) => {
          const url = new URL(request.url)
          const search = url.searchParams.get('search')

          if (search) {
            return HttpResponse.json({ notes: [] })
          }

          return HttpResponse.json({ notes: mockNotes })
        })
      )

      const { user } = renderWithProviders(<Component />)

      expect(await screen.findByText('Заметка 1')).toBeInTheDocument()

      const searchInput = screen.getByPlaceholderText(/поиск/i)
      await user.type(searchInput, 'несуществующая заметка')

      await waitFor(() => {
        expect(screen.queryByText(/заметка/i)).not.toBeInTheDocument()
      })
    })

    it('should gracefully display error message in list while keeping SearchInput interactive on server failure', async () => {
      let shouldFail = false

      server.use(
        http.get('*/api/v1/notes', ({ request }) => {
          const url = new URL(request.url)
          const search = url.searchParams.get('search')

          if (shouldFail && search) {
            return HttpResponse.json(null, { status: 500 })
          }

          return HttpResponse.json({ notes: mockNotes })
        })
      )

      const { user } = renderWithProviders(<Component />)

      expect(await screen.findByText('Заметка 1')).toBeInTheDocument()

      shouldFail = true
      const searchInput = screen.getByPlaceholderText(/поиск/i)
      await user.type(searchInput, 'ошибка')

      const errorMessage = await screen.findByText(/ошибка загрузки/i)
      expect(errorMessage).toBeInTheDocument()
      expect(searchInput).toHaveValue('ошибка')
    })
  })
})
