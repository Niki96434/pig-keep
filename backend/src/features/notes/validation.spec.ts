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
  it('should succeed with valid title and content', () => {
    const input = { title: 'Заголовок', content: 'Текст заметки' }
    const result = NoteCreateInSchema.safeParse(input)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(input)
    }
  })

  it('should succeed with only title', () => {
    const input = { title: 'Заголовок' }
    const result = NoteCreateInSchema.safeParse(input)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.title).toBe('Заголовок')
      expect(result.data.content).toBeUndefined()
    }
  })

  it('should succeed with only content', () => {
    const input = { content: 'Текст заметки' }
    const result = NoteCreateInSchema.safeParse(input)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.content).toBe('Текст заметки')
      expect(result.data.title).toBeUndefined()
    }
  })

  it('should trim whitespace from fields', () => {
    const input = { title: '  Заголовок с пробелами  ', content: '  Контент  ' }
    const result = NoteCreateInSchema.safeParse(input)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.title).toBe('Заголовок с пробелами')
      expect(result.data.content).toBe('Контент')
    }
  })

  it('should fail when both title and content are missing', () => {
    const input = {}
    const result = NoteCreateInSchema.safeParse(input)

    expect(result.success).toBe(false)
  })

  it('should fail when both title and content are empty strings or whitespace only', () => {
    const input = { title: '   ', content: '' }
    const result = NoteCreateInSchema.safeParse(input)

    expect(result.success).toBe(false)
  })

  it('should fail when title exceeds 255 characters', () => {
    const input = { title: 'a'.repeat(256), content: 'Контент' }
    const result = NoteCreateInSchema.safeParse(input)

    expect(result.success).toBe(false)
  })

  it('should fail when content exceeds 1000 characters', () => {
    const input = { title: 'Заголовок', content: 'a'.repeat(1001) }
    const result = NoteCreateInSchema.safeParse(input)

    expect(result.success).toBe(false)
  })
})

describe('NotePutInSchema', () => {
  it('should succeed with valid title and content', () => {
    const input = { title: 'Обновленный заголовок', content: 'Новый контент' }
    const result = NotePutInSchema.safeParse(input)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(input)
    }
  })

  it('should allow empty strings for title and content', () => {
    const input = { title: '', content: '' }
    const result = NotePutInSchema.safeParse(input)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({ title: '', content: '' })
    }
  })

  it('should fail on empty object', () => {
    const input = {}
    const result = NotePutInSchema.safeParse(input)

    expect(result.success).toBe(false)
  })

  it('should trim whitespace from fields', () => {
    const input = { title: '  Заголовок  ', content: '  Контент  ' }
    const result = NotePutInSchema.safeParse(input)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.title).toBe('Заголовок')
      expect(result.data.content).toBe('Контент')
    }
  })

  it('should fail when title exceeds 255 characters', () => {
    const input = { title: 'a'.repeat(256), content: 'Контент' }
    const result = NotePutInSchema.safeParse(input)

    expect(result.success).toBe(false)
  })

  it('should fail when content exceeds 1000 characters', () => {
    const input = { title: 'Заголовок', content: 'a'.repeat(1001) }
    const result = NotePutInSchema.safeParse(input)

    expect(result.success).toBe(false)
  })
})

describe('NotePatchInSchema', () => {
  it('should succeed when only title is provided', () => {
    const input = { title: 'Новый заголовок' }
    const result = NotePatchInSchema.safeParse(input)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.title).toBe('Новый заголовок')
      expect(result.data.content).toBeUndefined()
    }
  })

  it('should succeed when only content is provided', () => {
    const input = { content: 'Новый контент' }
    const result = NotePatchInSchema.safeParse(input)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.content).toBe('Новый контент')
      expect(result.data.title).toBeUndefined()
    }
  })

  it('should succeed when both title and content are provided', () => {
    const input = { title: 'Заголовок', content: 'Контент' }
    const result = NotePatchInSchema.safeParse(input)

    expect(result.success).toBe(true)
  })

  it('should fail when body is empty (neither title nor content provided)', () => {
    const input = {}
    const result = NotePatchInSchema.safeParse(input)

    expect(result.success).toBe(false)
  })

  it('should fail when title exceeds 255 characters', () => {
    const input = { title: 'a'.repeat(256) }
    const result = NotePatchInSchema.safeParse(input)

    expect(result.success).toBe(false)
  })

  it('should fail when content exceeds 1000 characters', () => {
    const input = { content: 'a'.repeat(1001) }
    const result = NotePatchInSchema.safeParse(input)

    expect(result.success).toBe(false)
  })
})

describe('NoteIdSchema', () => {
  it('should succeed with valid UUID', () => {
    const input = { id: randomUUID() }
    const result = NoteIdSchema.safeParse(input)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.id).toBe(input.id)
    }
  })

  it('should fail with invalid UUID string', () => {
    const input = { id: 'invalid-uuid-123' }
    const result = NoteIdSchema.safeParse(input)

    expect(result.success).toBe(false)
  })

  it('should fail when id is missing', () => {
    const input = {}
    const result = NoteIdSchema.safeParse(input)

    expect(result.success).toBe(false)
  })
})

describe('NoteSchema', () => {
  it('should succeed with valid full note object', () => {
    const input = {
      id: randomUUID(),
      user_id: randomUUID(),
      title: 'Заголовок',
      content: 'Контент',
    }
    const result = NoteSchema.safeParse(input)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(input)
    }
  })

  it('should fail when id or user_id is not a valid UUID', () => {
    const input = {
      id: 'invalid-id',
      user_id: randomUUID(),
      title: 'Заголовок',
      content: 'Контент',
    }
    const result = NoteSchema.safeParse(input)

    expect(result.success).toBe(false)
  })

  it('should fail when title exceeds 255 characters', () => {
    const input = {
      id: randomUUID(),
      user_id: randomUUID(),
      title: 'a'.repeat(256),
      content: 'Контент',
    }
    const result = NoteSchema.safeParse(input)

    expect(result.success).toBe(false)
  })

  it('should fail when content exceeds 1000 characters', () => {
    const input = {
      id: randomUUID(),
      user_id: randomUUID(),
      title: 'Заголовок',
      content: 'a'.repeat(1001),
    }
    const result = NoteSchema.safeParse(input)

    expect(result.success).toBe(false)
  })
})
