import { http, HttpResponse } from 'msw'
import { HttpStatus } from '@shared/constants/httpStatus'
import { notes } from './mockData'

const url = `http://localhost:${import.meta.env.VITE_SERVER_PORT}`
const noteId = '01928d73-d8ed-7211-a314-7081d763272c'
export const handlers = [
  http.get(`${url}/api/v1/notes`, () => {
    return HttpResponse.json(
      {
        notes: notes,
      },
      { status: HttpStatus.OK }
    )
  }),
  http.get<{ id: string }>(`${url}/api/v1/notes/:id`, ({ params }) => {
    const { id } = params
    const note = notes.find((item) => item.id === id)

    if (!note) {
      return HttpResponse.json({ error: 'Not found' }, { status: HttpStatus.NOT_FOUND })
    }

    return HttpResponse.json({ note }, { status: HttpStatus.OK })
  }),
  http.post<{ id: string }>(`${url}/api/v1/:id`, async ({ request }) => {
    const requestBody = await request.json()

    return HttpResponse.json(
      {
        note: {
          id: '01928d73-d8ed-7211-a314-7081d763282b',
          user_id: '12345678-28d73-d8ed-7211-a314-7081d763282d',
          requestBody,
        },
      },
      { status: HttpStatus.CREATED }
    )
  }),
  http.delete<{ id: string }>(`${url}/api/v1/notes/${noteId}`, async () => {
    return HttpResponse.json({ message: 'Success' }, { status: HttpStatus.OK })
  }),
]
