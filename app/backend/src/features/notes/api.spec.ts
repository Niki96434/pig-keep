import request from 'supertest'
import { app } from '../../app'
import { test_db } from '../../core/db/test_db'
import { sql } from 'drizzle-orm'
import { notesTable } from './schema'
import { randomUUID } from 'node:crypto'

const BASE_URL = '/api/v1/notes/'

beforeEach(async () => {
  await test_db.execute(sql`TRUNCATE TABLE ${notesTable}`)
})

describe('get notes', () => {
  it('should return empty array', async () => {
    const response = await request(app).get(BASE_URL)
    expect(response.status).toBe(200)
    expect(response.body.notes).toEqual([])
  })
})

describe('create note', () => {
  it('should create note', async () => {
    const response = await request(app)
      .post(BASE_URL)
      .send({ title: 'Тестовая заметка', content: 'Контент' })

    expect(response.status).toBe(201)
    expect(response.body.note.title).toBe('Тестовая заметка')
  })

  it('should return status code 400 if title and content are empty', async () => {
    const response = await request(app).post(BASE_URL).send({ title: null, content: null })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Validation error')
  })
})

describe('update note', () => {
  it('should return updated note', async () => {
    const createRes = await request(app)
      .post(BASE_URL)
      .send({ title: 'Тестовое заметище', content: 'Контентище' })

    const id = createRes.body.note.id

    const response = await request(app)
      .put(`${BASE_URL}${id}`)
      .send({ title: 'Обновленная заметка', content: 'Новый контент' })

    expect(response.status).toBe(200)
    expect(response.body.note.title).toBe('Обновленная заметка')
  }, 10_000)

  it('should return status code 404 if note id is not exist', async () => {
    const id = randomUUID()

    await expect(
      request(app)
        .put(`${BASE_URL}${id}`)
        .send({ title: 'Обновленная заметка', content: 'Новый контент' })
    ).resolves.toHaveProperty('status', 404)
  })

  it('should return a 400 status code if the id is not of type UUID', async () => {
    const id = '123'
    const errorMessage = 'Validation error'

    const res = await request(app).put(`${BASE_URL}${id}`).send({
      title: 'Заметка',
      content: 'Новая-приновая',
    })

    expect(res.status).toEqual(400)
    expect(JSON.parse(res.text).error).toBe(errorMessage)
  })
})

describe('patch note', () => {
  it('should change title field without clear content field', async () => {
    const title = 'Тестовая заметка'
    const content = 'Контентиище'

    const note = await request(app).post(BASE_URL).send({ title: title, content: 'Контентиище' })

    const noteId = JSON.parse(note.text).note.id

    const res = await request(app).patch(`${BASE_URL}${noteId}`).send({ title: 'Новая заметка' })

    expect(JSON.parse(res.text).note.title).toBe('Новая заметка')
    expect(JSON.parse(res.text).note.content).toBe(content)
  })

  it('should change content field without clear title field', async () => {
    const title = 'Тестовая заметка'
    const content = 'Контентиище'

    const note = await request(app).post(BASE_URL).send({ title: title, content: content })

    const noteId = JSON.parse(note.text).note.id

    const res = await request(app).patch(`${BASE_URL}${noteId}`).send({ content: 'Новая заметка' })

    expect(JSON.parse(res.text).note.content).toBe('Новая заметка')
    expect(JSON.parse(res.text).note.title).toBe(title)
  })
})

describe('delete note', () => {
  it('should delete note', async () => {
    const createRes = await request(app)
      .post(BASE_URL)
      .send({ title: 'Тестовая заметка для удаления', content: 'Контент' })

    const id = createRes.body.note.id
    const response = await request(app).delete(`${BASE_URL}${id}`)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Success')
  })
})
