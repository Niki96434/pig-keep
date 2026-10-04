import { defineRelations, sql } from 'drizzle-orm'
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const pets = pgTable('pets', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 255 }).notNull(),
  level: integer('level').default(1).notNull(),
  progress: integer('progress').default(0).notNull(),
})

export const actionTypes = pgTable('action_types', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  weight: integer('weight').notNull(),
})

export const actionLogs = pgTable(
  'action_logs',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    petId: uuid('pet_id')
      .notNull()
      .references(() => pets.id, { onDelete: 'cascade' }),
    actionTypeId: integer('action_type_id')
      .notNull()
      .references(() => actionTypes.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('idx_action_logs_pet_id').on(table.petId),
    index('idx_action_logs_created_at').on(table.createdAt),
    index('idx_action_logs_cron_covering').on(
      table.createdAt,
      table.petId,
      table.actionTypeId
    ),
  ]
)

export const levelRequirements = pgTable('level_requirements', {
  level: integer('level').primaryKey(),
  requiredXp: integer('required_xp').notNull(),
})

export const petsRelations = defineRelations({ pets, actionLogs, actionTypes }, (r) => ({
  pets: {
    logs: r.many.actionLogs({
      from: r.pets.id,
      to: r.actionLogs.petId,
    }),
  },
  actionTypes: {
    logs: r.many.actionLogs({
      from: r.actionTypes.id,
      to: r.actionLogs.actionTypeId,
    }),
  },
  actionLogs: {
    pet: r.one.pets({
      from: r.actionLogs.petId,
      to: r.pets.id,
    }),
    actionType: r.one.actionTypes({
      from: r.actionLogs.actionTypeId,
      to: r.actionTypes.id,
    }),
  },
}))

export const petsTable = pets
export const actionTypesTable = actionTypes
export const actionLogsTable = actionLogs
export const levelRequirementsTable = levelRequirements

export type Pet = typeof pets.$inferSelect
export type NewPet = typeof pets.$inferInsert

export type ActionType = typeof actionTypes.$inferSelect
export type NewActionType = typeof actionTypes.$inferInsert

export type ActionLog = typeof actionLogs.$inferSelect
export type NewActionLog = typeof actionLogs.$inferInsert

export type LevelRequirement = typeof levelRequirements.$inferSelect
export type NewLevelRequirement = typeof levelRequirements.$inferInsert
