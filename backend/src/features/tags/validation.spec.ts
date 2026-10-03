import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import {
  TagCreateInSchema,
  TagIdSchema,
  TagSchema,
} from '@app/shared/tags/validationSchemas'

describe('TagCreateInSchema', () => {
  it('should succeed with valid name and trim whitespace', () => {
    const result = TagCreateInSchema.safeParse({ name: '  Работа  ' })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Работа')
    }
  })

  it('should fail when name is empty, whitespace only, or missing', () => {
    expect(TagCreateInSchema.safeParse({ name: '' }).success).toBe(false)
    expect(TagCreateInSchema.safeParse({ name: '   ' }).success).toBe(false)
    expect(TagCreateInSchema.safeParse({}).success).toBe(false)
  })

  it('should fail when name exceeds 255 characters', () => {
    expect(TagCreateInSchema.safeParse({ name: 'a'.repeat(256) }).success).toBe(false)
  })
})

describe('TagIdSchema', () => {
  it('should validate UUID correctly', () => {
    expect(TagIdSchema.safeParse({ id: randomUUID() }).success).toBe(true)
    expect(TagIdSchema.safeParse({ id: 'invalid-uuid' }).success).toBe(false)
    expect(TagIdSchema.safeParse({}).success).toBe(false)
  })
})

describe('TagSchema', () => {
  it('should succeed with valid full tag object', () => {
    const input = { id: randomUUID(), name: 'Работа' }
    const result = TagSchema.safeParse(input)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(input)
    }
  })
})
