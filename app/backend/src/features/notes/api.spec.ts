import { randomUUID } from 'node:crypto'
import { sql } from 'drizzle-orm'
import request from 'supertest'
import { app } from '../../app'
import { test_db, test_pool } from '../../core/db/test_db'
import { mockData } from './fixtures'
import { notesTable } from './schema'

const BASE_URL = '/api/v1/notes'
const VALIDATION_ERROR = 'Validation error'
const INVALID_UUID = '123'
const defaultPayload = { title: 'Тестовая заметка', content: 'Контент' }
const updatedPayload = { title: 'Обновленная заметка', content: 'Новый контент' }

const createTestNote = async (
  data: { title?: string | null; content?: string | null } = defaultPayload
) => {
  const res = await request(app).post(BASE_URL).send(data)
  return res.body.note
}

beforeEach(async () => {
  await test_db.execute(sql`TRUNCATE TABLE ${notesTable}`)
})

afterAll(async () => await test_pool.end())

describe('get notes', () => {
  it('should return empty array', async () => {
    const res = await request(app).get(BASE_URL)

    expect(res.status).toBe(200)
    expect(res.body.notes).toEqual([])
  })

  it('should return non-empty array', async () => {
    await createTestNote()

    const res = await request(app).get(BASE_URL)

    expect(res.body.notes[0].title).toBe(defaultPayload.title)
    expect(res.body.notes[0].content).toBe(defaultPayload.content)
  })
})

describe('create note', () => {
  it('should create note', async () => {
    const res = await request(app).post(BASE_URL).send(defaultPayload)

    expect(res.status).toBe(201)
    expect(res.body.note.title).toBe(defaultPayload.title)
  })

  it('should return status code 400 if title and content are empty', async () => {
    const res = await request(app).post(BASE_URL).send({ title: null, content: null })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe(VALIDATION_ERROR)
  })
})

describe('update note', () => {
  it('should return updated note', async () => {
    const note = await createTestNote()

    const res = await request(app).put(`${BASE_URL}/${note.id}`).send(updatedPayload)

    expect(res.status).toBe(200)
    expect(res.body.note.title).toBe(updatedPayload.title)
  })

  it('should return status code 404 if note id is not exist', async () => {
    const res = await request(app).put(`${BASE_URL}/${randomUUID()}`).send(updatedPayload)

    expect(res.status).toBe(404)
  })

  it('should return a 400 status code if the id is not of type UUID', async () => {
    const res = await request(app).put(`${BASE_URL}/${INVALID_UUID}`).send({
      title: 'Заметка',
      content: 'Новая-приновая',
    })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe(VALIDATION_ERROR)
  })

  it('empty strings should be sent, and a 200 status code should be returned.', async () => {
    const note = await createTestNote()

    const res = await request(app).put(`${BASE_URL}/${note.id}`).send({ title: '', content: '' })

    expect(res.status).toBe(200)
    expect(res.body.note.title).toBe('')
    expect(res.body.note.content).toBe('')
  })

  it('should return an error due to exceeding the limits for title(255) and content(1000)', async () => {
    const note = await createTestNote()

    const res = await request(app)
      .put(`${BASE_URL}/${note.id}`)
      .send({ title: mockData.title, content: mockData.content })

    expect(res.status).toBe(400)

    const testQuery = await request(app).get(`${BASE_URL}/${note.id}`)

    expect(testQuery.status).toBe(404)
  })
})

describe('patch note', () => {
  it('should change title field without clear content field', async () => {
    const payload = { title: 'Тестовая заметка', content: 'Контентиище' }
    const note = await createTestNote(payload)

    const res = await request(app).patch(`${BASE_URL}/${note.id}`).send({ title: 'Новая заметка' })

    expect(res.body.note.title).toBe('Новая заметка')
    expect(res.body.note.content).toBe(payload.content)
  })

  it('should change content field without clear title field', async () => {
    const payload = { title: 'Тестовая заметка', content: 'Контентиище' }
    const note = await createTestNote(payload)

    const res = await request(app)
      .patch(`${BASE_URL}/${note.id}`)
      .send({ content: 'Новая заметка' })

    expect(res.body.note.content).toBe('Новая заметка')
    expect(res.body.note.title).toBe(payload.title)
  })

  it('should return a 400 status code if the id is not of type UUID', async () => {
    const res = await request(app)
      .patch(`${BASE_URL}/${INVALID_UUID}`)
      .send({ title: 'Обновленная заметка' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe(VALIDATION_ERROR)
  })

  it('should return status code 404 if note id is not exist', async () => {
    const id = randomUUID()

    const res = await request(app).patch(`${BASE_URL}/${id}`).send({ title: 'Обновленная заметка' })

    expect(res.status).toBe(404)
  })

  it('should return status code 400 if empty body is sent', async () => {
    const note = await createTestNote()

    const res = await request(app).patch(`${BASE_URL}/${note.id}`).send({})

    expect(res.status).toBe(400)
    expect(res.body.error).toBe(VALIDATION_ERROR)
  })
})

describe('delete note', () => {
  it('should delete note', async () => {
    const note = await createTestNote()
    const res = await request(app).delete(`${BASE_URL}/${note.id}`)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Success')

    const testQuery = await request(app).get(`${BASE_URL}/${note.id}`)

    expect(testQuery.status).toBe(404)
  })

  it('should return a 400 status code if the id is not of type UUID', async () => {
    const res = await request(app).delete(`${BASE_URL}/${INVALID_UUID}`)

    expect(res.status).toBe(400)
    expect(res.body.error).toBe(VALIDATION_ERROR)
  })

  it('should return status code 400 if note does not exist', async () => {
    const id = randomUUID()

    const res = await request(app).delete(`${BASE_URL}/${id}`)

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Bad request')
  })
})
