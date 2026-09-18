import request from 'supertest'
import { app } from '../../app'
import { test_db } from '../../core/db/test_db'
import { sql } from 'drizzle-orm'
import { notesTable } from './schema'
import { randomUUID } from 'node:crypto'
import { test_pool } from './../../core/db/test_db'
import { mockData } from './fixtures'

const BASE_URL = '/api/v1/notes'

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
    await request(app).post(BASE_URL).send({ title: 'Тестовая заметка', content: 'Контент' })

    const res = await request(app).get(BASE_URL)

    expect(res.body.notes[0].title).toBe('Тестовая заметка')
    expect(res.body.notes[0].content).toBe('Контент')
  })
})

describe('create note', () => {
  it('should create note', async () => {
    const res = await request(app)
      .post(BASE_URL)
      .send({ title: 'Тестовая заметка', content: 'Контент' })

    expect(res.status).toBe(201)
    expect(res.body.note.title).toBe('Тестовая заметка')
  })

  it('should return status code 400 if title and content are empty', async () => {
    const res = await request(app).post(BASE_URL).send({ title: null, content: null })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Validation error')
  })
})

describe('update note', () => {
  it('should return updated note', async () => {
    const createRes = await request(app)
      .post(BASE_URL)
      .send({ title: 'Тестовое заметище', content: 'Контентище' })

    const id = createRes.body.note.id

    const res = await request(app)
      .put(`${BASE_URL}/${id}`)
      .send({ title: 'Обновленная заметка', content: 'Новый контент' })

    expect(res.status).toBe(200)
    expect(res.body.note.title).toBe('Обновленная заметка')
  })

  it('should return status code 404 if note id is not exist', async () => {
    const id = randomUUID()

    const res = await request(app)
      .put(`${BASE_URL}/${id}`)
      .send({ title: 'Обновленная заметка', content: 'Новый контент' })

    expect(res.status).toBe(404)
  })

  it('should return a 400 status code if the id is not of type UUID', async () => {
    const id = '123'
    const errorMessage = 'Validation error'

    const res = await request(app).put(`${BASE_URL}/${id}`).send({
      title: 'Заметка',
      content: 'Новая-приновая',
    })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe(errorMessage)
  })

  it('empty strings should be sent, and a 200 status code should be returned.', async () => {
    const createRes = await request(app)
      .post(BASE_URL)
      .send({ title: 'Тестовое заметище', content: 'Контентище' })

    const id = createRes.body.note.id

    const res = await request(app).put(`${BASE_URL}/${id}`).send({ title: '', content: '' })

    expect(res.status).toBe(200)
    expect(res.body.note.title).toBe('')
    expect(res.body.note.content).toBe('')
  })

  it('should return an error due to exceeding the limits for title(255) and content(1000)', async () => {
    const createRes = await request(app)
      .post(BASE_URL)
      .send({ title: 'Тестовое заметище', content: 'Контентище' })

    const id = createRes.body.note.id

    const res = await request(app)
      .put(`${BASE_URL}/${id}`)
      .send({ title: mockData.title, content: mockData.content })

    expect(res.status).toBe(400)

    const testQuery = await request(app).get(`${BASE_URL}/${id}`)

    expect(testQuery.status).toBe(404)
  })
})

describe('patch note', () => {
  it('should change title field without clear content field', async () => {
    const title = 'Тестовая заметка'
    const content = 'Контентиище'

    const note = await request(app).post(BASE_URL).send({ title: title, content: 'Контентиище' })

    const noteId = note.body.note.id

    const res = await request(app).patch(`${BASE_URL}/${noteId}`).send({ title: 'Новая заметка' })

    expect(res.body.note.title).toBe('Новая заметка')
    expect(res.body.note.content).toBe(content)
  })

  it('should change content field without clear title field', async () => {
    const title = 'Тестовая заметка'
    const content = 'Контентиище'

    const note = await request(app).post(BASE_URL).send({ title: title, content: content })

    const noteId = note.body.note.id

    const res = await request(app).patch(`${BASE_URL}/${noteId}`).send({ content: 'Новая заметка' })

    expect(res.body.note.content).toBe('Новая заметка')
    expect(res.body.note.title).toBe(title)
  })
})

describe('delete note', () => {
  it('should delete note', async () => {
    const createRes = await request(app)
      .post(BASE_URL)
      .send({ title: 'Тестовая заметка для удаления', content: 'Контент' })

    const id = createRes.body.note.id
    const res = await request(app).delete(`${BASE_URL}/${id}`)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Success')

    const testQuery = await request(app).get(`${BASE_URL}/${id}`)

    expect(testQuery.status).toBe(404)
  })
})
