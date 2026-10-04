import { describe, expect, it } from 'vitest'
import { PgDialect } from 'drizzle-orm/pg-core'
import type { SQL } from 'drizzle-orm'
import { processDailyPetProgress } from './processDailyPetProgress'
import {
  actionLogs,
  actionTypes,
  levelRequirements,
  pets,
} from './schema'

describe('Pets XP Architecture', () => {
  describe('Database Schemas (3NF)', () => {
    it('should define pets table with correct columns', () => {
      expect(pets.id).toBeDefined()
      expect(pets.name).toBeDefined()
      expect(pets.level).toBeDefined()
      expect(pets.progress).toBeDefined()
      expect(pets.pleasureIndex).toBeDefined()
    })

    it('should define action_types table with weight', () => {
      expect(actionTypes.id).toBeDefined()
      expect(actionTypes.name).toBeDefined()
      expect(actionTypes.weight).toBeDefined()
    })

    it('should define action_logs table with foreign keys and timestamp', () => {
      expect(actionLogs.id).toBeDefined()
      expect(actionLogs.petId).toBeDefined()
      expect(actionLogs.actionTypeId).toBeDefined()
      expect(actionLogs.createdAt).toBeDefined()
    })

    it('should define level_requirements table with level and required_xp', () => {
      expect(levelRequirements.level).toBeDefined()
      expect(levelRequirements.requiredXp).toBeDefined()
    })
  })

  describe('processDailyPetProgress query logic', () => {
    const dialect = new PgDialect()

    it('should acquire lock and execute single-pass CTE update inside transaction', async () => {
      const executedQueries: string[] = []

      const mockTx = {
        execute: async (queryObj: SQL) => {
          const sqlString = dialect.sqlToQuery(queryObj).sql
          executedQueries.push(sqlString)

          return {
            rows: [
              { id: 'pet-1', old_level: 1, new_level: 2, new_progress: 15 },
              { id: 'pet-2', old_level: 1, new_level: 1, new_progress: 40 },
            ],
          }
        },
      }

      const mockDb = {
        transaction: async (cb: (tx: typeof mockTx) => Promise<unknown>) => {
          return await cb(mockTx)
        },
      } as unknown as Parameters<typeof processDailyPetProgress>[0]

      const result = await processDailyPetProgress(mockDb, {
        startDate: new Date('2026-10-04T00:00:00Z'),
        endDate: new Date('2026-10-05T00:00:00Z'),
      })

      expect(result.updatedPetsCount).toBe(2)
      expect(result.leveledUpCount).toBe(1)

      expect(executedQueries[0]).toContain('pg_advisory_xact_lock')

      const mainQuery = executedQueries[1]
      expect(mainQuery).toContain('WITH')
      expect(mainQuery).toContain('daily_xp AS')
      expect(mainQuery).toContain('UPDATE')
      expect(mainQuery).toContain('CASE')
      expect(mainQuery).toContain('required_xp')
      expect(mainQuery).toContain('RETURNING')
    })
  })
})
