import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import {
  NoteCreateInSchema,
  NotePutInSchema,
  NotePatchInSchema,
  NoteIdSchema,
  NoteSchema,
} from '@app/shared/notes/validationSchemas'

describe('NoteCreateInSchema', () => {
  it('should succeed with valid data and trim whitespace', () => {
    const result = NoteCreateInSchema.safeParse({
      title: '  Заголовок  ',
      content: '  Контент  ',
    })

    expect(result.success).toBe(true)
    expect(result.data).toEqual({ title: 'Заголовок', content: 'Контент' })
  })

  it('should allow either only title or only content', () => {
    expect(NoteCreateInSchema.safeParse({ title: 'Заголовок' }).success).toBe(true)
    expect(NoteCreateInSchema.safeParse({ content: 'Контент' }).success).toBe(true)
  })

  it('should fail when both fields are missing or whitespace-only', () => {
    expect(NoteCreateInSchema.safeParse({}).success).toBe(false)
    expect(NoteCreateInSchema.safeParse({ title: '   ', content: '' }).success).toBe(false)
  })
})

describe('NotePutInSchema', () => {
  it('should require both title and content (allowing empty strings)', () => {
    expect(NotePutInSchema.safeParse({ title: 'Заголовок', content: 'Контент' }).success).toBe(true)
    expect(NotePutInSchema.safeParse({ title: '', content: '' }).success).toBe(true)
    expect(NotePutInSchema.safeParse({ title: 'Заголовок' }).success).toBe(false)
    expect(NotePutInSchema.safeParse({}).success).toBe(false)
  })
})

describe('NotePatchInSchema', () => {
  it('should succeed when at least one field is provided', () => {
    expect(NotePatchInSchema.safeParse({ title: 'Новый' }).success).toBe(true)
    expect(NotePatchInSchema.safeParse({ isArchive: true }).success).toBe(true)
  })

  it('should fail when body is empty', () => {
    expect(NotePatchInSchema.safeParse({}).success).toBe(false)
  })
})

describe('NoteIdSchema', () => {
  it('should validate UUID correctly', () => {
    expect(NoteIdSchema.safeParse({ id: randomUUID() }).success).toBe(true)
    expect(NoteIdSchema.safeParse({ id: 'invalid-uuid' }).success).toBe(false)
    expect(NoteIdSchema.safeParse({}).success).toBe(false)
  })
})

describe('NoteSchema', () => {
  it('should validate full note contract', () => {
    const validNote = {
      id: randomUUID(),
      title: 'Заголовок',
      content: 'Контент',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    expect(NoteSchema.safeParse(validNote).success).toBe(true)
    expect(NoteSchema.safeParse({ ...validNote, id: 'invalid-uuid' }).success).toBe(false)
  })
})
