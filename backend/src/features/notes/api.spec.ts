import { randomUUID } from 'node:crypto'
import { sql } from 'drizzle-orm'
import request from 'supertest'
import { app } from '../../app'
import { test_db, test_pool } from '../../core/db/test_db'
import { notesTable } from './schema'

const BASE_URL = '/api/v1/notes'
const VALIDATION_ERROR = 'Validation error'
const INVALID_UUID = '123'
const defaultPayload = { title: 'Тестовая заметка', content: 'Контент' }
const updatedPayload = { title: 'Обновленная заметка', content: 'Новый контент' }

const seedNote = async (data: Partial<typeof notesTable.$inferInsert> = {}) => {
  const [note] = await test_db
    .insert(notesTable)
    .values({
      title: defaultPayload.title,
      content: defaultPayload.content,
      ...data,
    })
    .returning()

  return note
}

beforeEach(async () => {
  await test_db.execute(sql`TRUNCATE TABLE ${notesTable}`)
})

afterAll(async () => await test_pool.end())

describe('GET /api/v1/notes', () => {
  it('should return empty array when no notes exist', async () => {
    const res = await request(app).get(BASE_URL)

    expect(res.status).toBe(200)
    expect(res.body.notes).toEqual([])
  })

  it('should return non-empty array with existing notes', async () => {
    const seeded = await seedNote()

    const res = await request(app).get(BASE_URL)

    expect(res.status).toBe(200)
    expect(res.body.notes).toHaveLength(1)
    expect(res.body.notes[0]).toMatchObject({
      id: seeded?.id,
      title: seeded?.title,
      content: seeded?.content,
    })
  })
})

describe('POST /api/v1/notes', () => {
  it('should create note and return 201', async () => {
    const res = await request(app).post(BASE_URL).send(defaultPayload)

    expect(res.status).toBe(201)
    expect(res.body.note).toMatchObject({
      id: expect.any(String),
      title: defaultPayload.title,
      content: defaultPayload.content,
    })
  })

  it('should return status code 400 if title and content are empty', async () => {
    const res = await request(app).post(BASE_URL).send({ title: null, content: null })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe(VALIDATION_ERROR)
  })
})

describe('PUT /api/v1/notes/:id', () => {
  it('should return updated note and 200', async () => {
    const note = await seedNote()

    const res = await request(app).put(`${BASE_URL}/${note?.id}`).send(updatedPayload)

    expect(res.status).toBe(200)
    expect(res.body.note).toMatchObject({
      id: note?.id,
      title: updatedPayload.title,
      content: updatedPayload.content,
    })
  })

  it('should return status code 404 if note id does not exist', async () => {
    const res = await request(app).put(`${BASE_URL}/${randomUUID()}`).send(updatedPayload)

    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Not found')
  })

  it('should return a 400 status code if the id is not of type UUID', async () => {
    const res = await request(app).put(`${BASE_URL}/${INVALID_UUID}`).send({
      title: 'Заметка',
      content: 'Новая-приновая',
    })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe(VALIDATION_ERROR)
  })

  it('should return 200 when updating with empty strings', async () => {
    const note = await seedNote()

    const res = await request(app).put(`${BASE_URL}/${note?.id}`).send({ title: '', content: '' })

    expect(res.status).toBe(200)
    expect(res.body.note).toMatchObject({
      id: note?.id,
      title: '',
      content: '',
    })
  })
})

describe('PATCH /api/v1/notes/:id', () => {
  it('should change title field without clearing content field', async () => {
    const note = await seedNote({ title: 'Тестовая заметка', content: 'Контентиище' })

    const res = await request(app).patch(`${BASE_URL}/${note?.id}`).send({ title: 'Новая заметка' })

    expect(res.status).toBe(200)
    expect(res.body.note).toMatchObject({
      id: note?.id,
      title: 'Новая заметка',
      content: 'Контентиище',
    })
  })

  it('should change content field without clearing title field', async () => {
    const note = await seedNote({ title: 'Тестовая заметка', content: 'Контентиище' })

    const res = await request(app)
      .patch(`${BASE_URL}/${note?.id}`)
      .send({ content: 'Новая заметка' })

    expect(res.status).toBe(200)
    expect(res.body.note).toMatchObject({
      id: note?.id,
      title: 'Тестовая заметка',
      content: 'Новая заметка',
    })
  })

  it('should return a 400 status code if the id is not of type UUID', async () => {
    const res = await request(app)
      .patch(`${BASE_URL}/${INVALID_UUID}`)
      .send({ title: 'Обновленная заметка' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe(VALIDATION_ERROR)
  })

  it('should return status code 404 if note id does not exist', async () => {
    const id = randomUUID()

    const res = await request(app).patch(`${BASE_URL}/${id}`).send({ title: 'Обновленная заметка' })

    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Not found')
  })

  it('should return status code 400 if empty body is sent', async () => {
    const note = await seedNote()

    const res = await request(app).patch(`${BASE_URL}/${note?.id}`).send({})

    expect(res.status).toBe(400)
    expect(res.body.error).toBe(VALIDATION_ERROR)
  })
})

describe('DELETE /api/v1/notes/:id', () => {
  it('should delete note and return 200', async () => {
    const note = await seedNote()
    const res = await request(app).delete(`${BASE_URL}/${note?.id}`)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Success')

    const notesInDb = await test_db.select().from(notesTable)
    expect(notesInDb).toHaveLength(0)
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
