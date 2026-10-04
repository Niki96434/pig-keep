import type { Pet, PetPatchIn } from '@app/shared/pets/types'
import { getPetMood } from '@app/shared/pets/validationSchemas'
import { eq, sql } from 'drizzle-orm'
import { db as defaultDb } from '../../core/db/'
import { actionLogs, actionTypes, levelRequirements, pets } from './schema'

const DEFAULT_REQUIRED_XP_PER_LEVEL = 500
const DEFAULT_PET_NAME = 'Борис'

const DEFAULT_ACTION_WEIGHTS: Record<string, number> = {
  create_note: 20,
  update_note: 10,
  archive_note: 5,
  delete_note: 5,
  create_tag: 15,
  add_tag: 5,
  delete_tag: 5,
}

interface DBType {
  db: typeof defaultDb
}

export function repository({ db }: DBType) {
  const ensureLevelRequirements = async (level: number) => {
    const [existing] = await db
      .select()
      .from(levelRequirements)
      .where(eq(levelRequirements.level, level))

    if (!existing) {
      const requiredXp = level * DEFAULT_REQUIRED_XP_PER_LEVEL
      await db
        .insert(levelRequirements)
        .values({ level, requiredXp })
        .onConflictDoNothing()
      return requiredXp
    }

    return existing.requiredXp
  }

  const formatPet = (
    petRow: typeof pets.$inferSelect,
    requiredXp: number
  ): Pet => {
    return {
      id: petRow.id,
      name: petRow.name,
      level: petRow.level,
      progress: petRow.progress,
      pleasureIndex: petRow.pleasureIndex,
      requiredXp,
      mood: getPetMood(petRow.pleasureIndex),
    }
  }

  const getCurrentPetFromDB = async (): Promise<Pet> => {
    const rows = await db
      .select({
        pet: pets,
        requiredXp: levelRequirements.requiredXp,
      })
      .from(pets)
      .leftJoin(levelRequirements, eq(levelRequirements.level, pets.level))
      .limit(1)

    const firstRow = rows[0]
    if (firstRow && firstRow.pet) {
      const pet = firstRow.pet
      const requiredXp =
        firstRow.requiredXp ?? (await ensureLevelRequirements(pet.level))
      return formatPet(pet, requiredXp)
    }

    // Initialize default pet if none exists
    const [newPet] = await db
      .insert(pets)
      .values({
        name: DEFAULT_PET_NAME,
        level: 1,
        progress: 0,
        pleasureIndex: 100,
      })
      .returning()

    if (!newPet) {
      throw new Error('Failed to create default pet')
    }

    const requiredXp = await ensureLevelRequirements(1)
    return formatPet(newPet, requiredXp)
  }

  const getPetByIdFromDB = async (petId: string): Promise<Pet | undefined> => {
    const [row] = await db
      .select({
        pet: pets,
        requiredXp: levelRequirements.requiredXp,
      })
      .from(pets)
      .leftJoin(levelRequirements, eq(levelRequirements.level, pets.level))
      .where(eq(pets.id, petId))

    if (!row || !row.pet) return undefined

    const requiredXp =
      row.requiredXp ?? (await ensureLevelRequirements(row.pet.level))
    return formatPet(row.pet, requiredXp)
  }

  const patchPetFromDB = async (
    petId: string,
    data: PetPatchIn
  ): Promise<Pet | undefined> => {
    const updateValues: Partial<typeof pets.$inferInsert> = {}

    if (data.name !== undefined) {
      updateValues.name = data.name
    }

    if (data.pleasureIndex !== undefined) {
      updateValues.pleasureIndex = Math.max(0, Math.min(100, data.pleasureIndex))
    }

    if (Object.keys(updateValues).length > 0) {
      await db.update(pets).set(updateValues).where(eq(pets.id, petId))
    }

    return await getPetByIdFromDB(petId)
  }

  const logAction = async (actionName: string, petId?: string) => {
    let targetPetId = petId

    if (!targetPetId) {
      const currentPet = await getCurrentPetFromDB()
      targetPetId = currentPet.id
    }

    // Get or create action type
    let [actionType] = await db
      .select()
      .from(actionTypes)
      .where(eq(actionTypes.name, actionName))

    if (!actionType) {
      const weight = DEFAULT_ACTION_WEIGHTS[actionName] ?? 10
      const [created] = await db
        .insert(actionTypes)
        .values({ name: actionName, weight })
        .returning()
      actionType = created
    }

    if (!actionType) {
      throw new Error(`Failed to resolve action type: ${actionName}`)
    }

    // Insert log
    const [log] = await db
      .insert(actionLogs)
      .values({
        petId: targetPetId,
        actionTypeId: actionType.id,
      })
      .returning()

    // Increase pleasure index on activity (up to 100)
    await db
      .update(pets)
      .set({
        pleasureIndex: sql`LEAST(100, ${pets.pleasureIndex} + 5)`,
      })
      .where(eq(pets.id, targetPetId))

    return log
  }

  return {
    getCurrentPetFromDB,
    getPetByIdFromDB,
    patchPetFromDB,
    logAction,
  }
}
