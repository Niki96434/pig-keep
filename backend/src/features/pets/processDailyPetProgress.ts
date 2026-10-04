import { sql } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { actionLogs, actionTypes, levelRequirements, pets } from './schema'

export interface ProcessDailyProgressOptions {
  startDate?: Date
  endDate?: Date
}

export interface ProcessDailyProgressResult {
  updatedPetsCount: number
  leveledUpCount: number
  period: {
    startDate: Date
    endDate: Date
  }
}

const CRON_ADVISORY_LOCK_ID = sql`hashtext('daily_pet_progress_cron_lock')`

export async function processDailyPetProgress(
  db: NodePgDatabase,
  options: ProcessDailyProgressOptions = {}
): Promise<ProcessDailyProgressResult> {
  const now = new Date()
  const defaultEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  const defaultStartDate = new Date(defaultEndDate.getTime() - 24 * 60 * 60 * 1000)

  const startDate = options.startDate ?? defaultStartDate
  const endDate = options.endDate ?? defaultEndDate

  return await db.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT pg_advisory_xact_lock(${CRON_ADVISORY_LOCK_ID});`
    )

    const recalculationQuery = sql<{
      id: string
      old_level: number
      new_level: number
      new_progress: number
    }>`
      WITH daily_xp AS (
        SELECT
          ${actionLogs.petId} AS pet_id,
          SUM(${actionTypes.weight})::int AS earned_xp
        FROM ${actionLogs}
        INNER JOIN ${actionTypes} 
          ON ${actionLogs.actionTypeId} = ${actionTypes.id}
        WHERE 
          ${actionLogs.createdAt} >= ${startDate} 
          AND ${actionLogs.createdAt} < ${endDate}
        GROUP BY ${actionLogs.petId}
      )
      UPDATE ${pets} AS p
      SET
        level = CASE
          WHEN lr.required_xp IS NOT NULL 
               AND (p.progress + dxp.earned_xp) >= lr.required_xp 
            THEN p.level + 1
          ELSE p.level
        END,
        progress = CASE
          WHEN lr.required_xp IS NOT NULL 
               AND (p.progress + dxp.earned_xp) >= lr.required_xp 
            THEN (p.progress + dxp.earned_xp) - lr.required_xp
          ELSE p.progress + dxp.earned_xp
        END
      FROM daily_xp dxp
      LEFT JOIN ${levelRequirements} lr 
        ON lr.level = p.level
      WHERE p.id = dxp.pet_id
      RETURNING 
        p.id,
        (p.level - CASE 
          WHEN lr.required_xp IS NOT NULL AND (p.progress + dxp.earned_xp) >= lr.required_xp THEN 1 
          ELSE 0 
        END) AS old_level,
        p.level AS new_level,
        p.progress AS new_progress;
    `

    const result = await tx.execute(recalculationQuery)
    const updatedRows = (result.rows ?? []) as Array<{
      id: string
      old_level: number
      new_level: number
      new_progress: number
    }>

    const leveledUpCount = updatedRows.filter(
      (row) => row.new_level > row.old_level
    ).length

    return {
      updatedPetsCount: updatedRows.length,
      leveledUpCount,
      period: {
        startDate,
        endDate,
      },
    }
  })
}
