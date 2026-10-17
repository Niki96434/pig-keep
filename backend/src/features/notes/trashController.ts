import type { NextFunction, Request, Response } from 'express'
import type { TrashRepositoryType } from './trashRepository'

interface ControllerProps {
  trashRepo: TrashRepositoryType
}

export function trashController({ trashRepo }: ControllerProps) {
  const clearTrash = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      await trashRepo.clearTrash()
      return res.status(200).json({ message: 'Success' })
    } catch (err) {
      return next(err)
    }
  }

  const restoreNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string
      const result = await trashRepo.restoreNote(id)
      if (result === 1) {
        return res.status(200).json({ message: 'Success' })
      }
      return res.status(404).json({ error: 'Not found' })
    } catch (err) {
      return next(err)
    }
  }

  const deleteByIdForever = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string
      const deletedCount = await trashRepo.deleteByIdForever(id)

      if (deletedCount === 1) {
        return res.status(200).json({ message: 'Success' })
      }

      return res.status(404).json({ error: 'Not found' })
    } catch (err) {
      return next(err)
    }
  }

  return { clearTrash, restoreNote, deleteByIdForever }
}
