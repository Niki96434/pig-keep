import { http, HttpResponse } from 'msw'
import { notes } from './mockData'

const url = `http://localhost:${import.meta.env.VITE_SERVER_PORT}`
const noteId = '01928d73-d8ed-7211-a314-7081d763272c'
export const handlers = [
  http.get(`${url}/api/v1/notes`, () => {
    return HttpResponse.json(
      {
        notes: notes,
      },
      { status: 200 }
    )
  }),
  http.get<{ id: string }>(`${url}/api/v1/notes/:id`, ({ params }) => {
    const { id } = params
    const note = notes.find((item) => item.id === id)

    if (!note) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return HttpResponse.json({ note }, { status: 200 })
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
      { status: 201 }
    )
  }),
  http.delete<{ id: string }>(`${url}/api/v1/notes/${noteId}`, async () => {
    return HttpResponse.json({ message: 'Success' }, { status: 200 })
  }),
  http.get(`${url}/api/v1/tags`, () => {
    return HttpResponse.json({ tags: [] }, { status: 200 })
  }),
  http.get<{ id: string }>(`${url}/api/v1/notes/:id/tags`, () => {
    return HttpResponse.json({ tags: [] }, { status: 200 })
  }),
  http.post<{ id: string; tagId: string }>(`${url}/api/v1/notes/:id/tags/:tagId`, () => {
    return HttpResponse.json({ message: 'Success' }, { status: 200 })
  }),
  http.delete<{ id: string; tagId: string }>(`${url}/api/v1/notes/:id/tags/:tagId`, () => {
    return HttpResponse.json({ message: 'Success' }, { status: 200 })
  }),
]
