import { screen, waitFor } from '@testing-library/react'
import { NoteForm } from './NoteForm'
import { renderWithProviders } from '@/shared/testing/test-utils'
import { http, HttpResponse } from 'msw'
import { server } from '@/shared/testing/msw/node'
import type { NoteCreateIn } from '@shared/notes/types'

async function setupForm() {
  const { user } = renderWithProviders(<NoteForm />)

  const input = screen.getByPlaceholderText(/заметка/i)
  await user.click(input)

  const firstTextarea = await screen.findByPlaceholderText(/название/i)
  const secondTextarea = await screen.findByPlaceholderText(/заметка/i)

  const background = screen.getByTestId(/background/)
  return { user, firstTextarea, secondTextarea, background }
}

function mockCreateNote() {
  const requestSpy = vi.fn()
  let requestBody: NoteCreateIn | undefined

  server.use(
    http.post('*/api/v1/notes', async ({ request }) => {
      requestBody = (await request.json()) as NoteCreateIn | undefined
      requestSpy()
      return HttpResponse.json({
        note: {
          id: '01928d73-d8ed-7211-a314-7081d763282b',
          user_id: '12345678-28d73-d8ed-7211-a314-7081d763282d',
          title: requestBody?.title ?? '',
          content: requestBody?.content ?? '',
        },
      })
    })
  )

  return { getRequestBody: () => requestBody, requestSpy }
}

describe('integration tests for NoteForm', () => {
  const titleNote = 'Заметка 4'
  const textNote = 'Содержимое четвёртой заметки'

  describe('user triggers', () => {
    it('should submit and close the form by clicking on the button', async () => {
      const { user, firstTextarea, secondTextarea } = await setupForm()

      const button = await screen.findByRole('button', { name: /закрыть/i })

      await user.type(firstTextarea, titleNote)
      expect(firstTextarea).toHaveValue(titleNote)

      await user.type(secondTextarea, textNote)
      expect(secondTextarea).toHaveValue(textNote)

      const { getRequestBody } = mockCreateNote()

      await user.click(button)

      await waitFor(() =>
        expect(getRequestBody()).toMatchObject({
          title: titleNote,
          content: textNote,
        })
      )

      expect(screen.queryByPlaceholderText(/название/i)).not.toBeInTheDocument()

      await user.click(screen.getByPlaceholderText(/заметка/i))
      expect(await screen.findByPlaceholderText(/название/i)).toHaveValue('')
      expect(screen.getByPlaceholderText(/заметка/i)).toHaveValue('')
    })

    it('should submit and close the form when clicking outside', async () => {
      const { user, firstTextarea, secondTextarea, background } = await setupForm()

      const { getRequestBody } = mockCreateNote()

      await user.type(firstTextarea, titleNote)
      expect(firstTextarea).toHaveValue(titleNote)

      await user.type(secondTextarea, textNote)
      expect(secondTextarea).toHaveValue(textNote)

      await user.click(background)

      await waitFor(() => {
        expect(getRequestBody()).toMatchObject({
          title: titleNote,
          content: textNote,
        })
      })

      await waitFor(() => {
        expect(screen.queryByPlaceholderText(/название/i)).not.toBeInTheDocument()
      })

      await user.click(await screen.findByPlaceholderText(/заметка/i))

      expect(await screen.findByPlaceholderText(/название/i)).toHaveValue('')
      expect(screen.getByPlaceholderText(/заметка/i)).toHaveValue('')
    })
  })

  describe('field validation', () => {
    it('should not submit the form if the form fields are empty or contain spaces', async () => {
      const { user, firstTextarea, secondTextarea, background } = await setupForm()

      await user.type(firstTextarea, '   ')
      await user.type(secondTextarea, '   ')

      const { requestSpy } = mockCreateNote()

      await user.click(background)

      expect(screen.queryByPlaceholderText(/название/i)).not.toBeInTheDocument()

      expect(requestSpy).not.toHaveBeenCalled()
    })

    it('should submit the form if only one field is filled in', async () => {
      const { user, firstTextarea, secondTextarea, background } = await setupForm()

      await user.type(firstTextarea, titleNote)
      await user.type(secondTextarea, '   ')

      const { getRequestBody } = mockCreateNote()

      await user.click(background)

      await waitFor(() =>
        expect(getRequestBody()).toMatchObject({ title: titleNote, content: '   ' })
      )

      expect(screen.queryByPlaceholderText(/название/i)).not.toBeInTheDocument()
    })
  })
})
