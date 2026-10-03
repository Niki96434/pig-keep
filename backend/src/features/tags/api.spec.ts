import { randomUUID } from 'node:crypto'
import { sql } from 'drizzle-orm'
import request from 'supertest'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../app'
import { tagsTable } from '../../core/db/schema'
import { test_db, test_pool } from '../../core/db/test_db'

const BASE_URL = '/api/v1/tags'

const seedTag = async (name = 'Тестовый тег') => {
  const [tag] = await test_db.insert(tagsTable).values({ name }).returning()
  return tag
}

beforeEach(async () => {
  await test_db.execute(sql`TRUNCATE TABLE ${tagsTable} CASCADE`)
})

afterAll(async () => await test_pool.end())

describe('GET /api/v1/tags', () => {
  it('should return all tags and filter by search query', async () => {
    const tag1 = await seedTag('Покупки')
    await seedTag('Работа')

    const resAll = await request(app).get(BASE_URL)
    expect(resAll.status).toBe(200)
    expect(resAll.body.tags).toHaveLength(2)

    const resSearch = await request(app).get(`${BASE_URL}?search=покупки`)
    expect(resSearch.status).toBe(200)
    expect(resSearch.body.tags).toHaveLength(1)
    expect(resSearch.body.tags[0].id).toBe(tag1?.id)
  })
})

describe('GET /api/v1/tags/:id', () => {
  it('should return tag by id when exists', async () => {
    const tag = await seedTag()
    const res = await request(app).get(`${BASE_URL}/${tag?.id}`)

    expect(res.status).toBe(200)
    expect(res.body.tag).toMatchObject({ id: tag?.id, name: tag?.name })
  })

  it('should return 404 if tag does not exist', async () => {
    const res = await request(app).get(`${BASE_URL}/${randomUUID()}`)
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Not found')
  })

  it('should return 400 for invalid UUID', async () => {
    const res = await request(app).get(`${BASE_URL}/invalid-uuid-123`)
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Validation error')
  })
})

describe('POST /api/v1/tags', () => {
  it('should create tag and return 201', async () => {
    const res = await request(app).post(BASE_URL).send({ name: 'Новый тег' })

    expect(res.status).toBe(201)
    expect(res.body.tag).toMatchObject({ id: expect.any(String), name: 'Новый тег' })
  })

  it('should return 400 on invalid body', async () => {
    const res = await request(app).post(BASE_URL).send({ name: '' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Validation error')
  })
})

describe('PUT /api/v1/tags/:id & PATCH /api/v1/tags/:id', () => {
  it('should update tag name', async () => {
    const tag = await seedTag('Старый тег')

    const resPut = await request(app).put(`${BASE_URL}/${tag?.id}`).send({ name: 'Обновленный тег' })
    expect(resPut.status).toBe(200)
    expect(resPut.body.tag.name).toBe('Обновленный тег')

    const resPatch = await request(app).patch(`${BASE_URL}/${tag?.id}`).send({ name: 'Патченый тег' })
    expect(resPatch.status).toBe(200)
    expect(resPatch.body.tag.name).toBe('Патченый тег')
  })

  it('should return 404 if tag to update does not exist', async () => {
    const res = await request(app).put(`${BASE_URL}/${randomUUID()}`).send({ name: 'Имя' })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /api/v1/tags/:id', () => {
  it('should delete existing tag', async () => {
    const tag = await seedTag()
    const res = await request(app).delete(`${BASE_URL}/${tag?.id}`)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Success')

    const tagsInDb = await test_db.select().from(tagsTable)
    expect(tagsInDb).toHaveLength(0)
  })

  it('should return 400 when deleting non-existent tag', async () => {
    const res = await request(app).delete(`${BASE_URL}/${randomUUID()}`)
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Bad request')
  })
})
