import { randomUUID } from 'node:crypto'
import { sql } from 'drizzle-orm'
import request from 'supertest'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../app'
import { actionLogs, actionTypes, levelRequirements, pets } from '../../core/db/schema'
import { test_db, test_pool } from '../../core/db/test_db'

const BASE_URL = '/api/v1/pets'

beforeEach(async () => {
  await test_db.execute(
    sql`TRUNCATE TABLE ${actionLogs}, ${pets}, ${levelRequirements}, ${actionTypes} CASCADE`
  )
})

afterAll(async () => await test_pool.end())

describe('GET /api/v1/pets', () => {
  it('should auto-initialize and return default pet when no pet exists', async () => {
    const res = await request(app).get(BASE_URL)

    expect(res.status).toBe(200)
    expect(res.body.pet).toBeDefined()
    expect(res.body.pet).toMatchObject({
      name: 'Борис',
      level: 1,
      progress: 0,
      pleasureIndex: 100,
      requiredXp: 500,
      mood: 'happy',
    })
    expect(res.body.pet.id).toBeDefined()
  })

  it('should return existing pet if already created', async () => {
    const [created] = await test_db
      .insert(pets)
      .values({
        name: 'Борис Тестовый',
        level: 2,
        progress: 150,
        pleasureIndex: 85,
      })
      .returning()

    if (!created) throw new Error('Failed to seed pet')

    await test_db
      .insert(levelRequirements)
      .values({ level: 2, requiredXp: 1000 })
      .onConflictDoNothing()

    const res = await request(app).get(BASE_URL)

    expect(res.status).toBe(200)
    expect(res.body.pet).toMatchObject({
      id: created.id,
      name: 'Борис Тестовый',
      level: 2,
      progress: 150,
      pleasureIndex: 85,
      requiredXp: 1000,
      mood: 'happy',
    })
  })
})

describe('GET /api/v1/pets/:id', () => {
  it('should return pet by valid id', async () => {
    const [created] = await test_db
      .insert(pets)
      .values({
        name: 'Борис',
        level: 1,
        progress: 50,
        pleasureIndex: 60,
      })
      .returning()

    if (!created) throw new Error('Failed to seed pet')

    const res = await request(app).get(`${BASE_URL}/${created.id}`)

    expect(res.status).toBe(200)
    expect(res.body.pet).toMatchObject({
      id: created.id,
      name: 'Борис',
      pleasureIndex: 60,
      mood: 'neutral',
    })
  })

  it('should return 404 for non-existent pet id', async () => {
    const res = await request(app).get(`${BASE_URL}/${randomUUID()}`)
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Not found')
  })

  it('should return 400 for invalid UUID', async () => {
    const res = await request(app).get(`${BASE_URL}/invalid-id`)
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Validation error')
  })
})

describe('PATCH /api/v1/pets/:id', () => {
  it('should update name and pleasureIndex with proper mood transitions', async () => {
    const [created] = await test_db
      .insert(pets)
      .values({
        name: 'Борис',
        level: 1,
        progress: 0,
        pleasureIndex: 100,
      })
      .returning()

    if (!created) throw new Error('Failed to seed pet')

    // Update to neutral mood (pleasureIndex 50)
    const resNeutral = await request(app)
      .patch(`${BASE_URL}/${created.id}`)
      .send({ pleasureIndex: 50 })

    expect(resNeutral.status).toBe(200)
    expect(resNeutral.body.pet.pleasureIndex).toBe(50)
    expect(resNeutral.body.pet.mood).toBe('neutral')

    // Update to sad mood (pleasureIndex 20)
    const resSad = await request(app)
      .patch(`${BASE_URL}/${created.id}`)
      .send({ pleasureIndex: 20 })

    expect(resSad.status).toBe(200)
    expect(resSad.body.pet.pleasureIndex).toBe(20)
    expect(resSad.body.pet.mood).toBe('sad')

    // Update to sleeping mood (pleasureIndex 0)
    const resSleep = await request(app)
      .patch(`${BASE_URL}/${created.id}`)
      .send({ pleasureIndex: 0 })

    expect(resSleep.status).toBe(200)
    expect(resSleep.body.pet.pleasureIndex).toBe(0)
    expect(resSleep.body.pet.mood).toBe('sleeping')
  })

  it('should return 404 for non-existent pet', async () => {
    const res = await request(app)
      .patch(`${BASE_URL}/${randomUUID()}`)
      .send({ name: 'Новое имя' })

    expect(res.status).toBe(404)
  })
})

describe('Pet activity integration with Notes', () => {
  it('should increase pleasureIndex when note is created', async () => {
    const [pet] = await test_db
      .insert(pets)
      .values({
        name: 'Борис',
        level: 1,
        progress: 0,
        pleasureIndex: 60,
      })
      .returning()

    if (!pet) throw new Error('Failed to seed pet')

    const createNoteRes = await request(app)
      .post('/api/v1/notes')
      .send({ title: 'Продуктивная заметка', content: 'Текст' })

    expect(createNoteRes.status).toBe(201)

    const petRes = await request(app).get(`${BASE_URL}/${pet.id}`)
    expect(petRes.status).toBe(200)
    // Pleasure index should have increased by at least 5 (60 -> 65+)
    expect(petRes.body.pet.pleasureIndex).toBeGreaterThanOrEqual(65)

    // Check action_logs
    const logs = await test_db.select().from(actionLogs)
    expect(logs.length).toBeGreaterThan(0)
  })
})

