import type { Request, Response } from 'express'
import type { Pet, PetPatchIn } from '@app/shared/pets/types'
import { HttpStatus } from '@app/shared/constants/httpStatus'

interface RepositoryType {
  repo: {
    getCurrentPetFromDB: () => Promise<Pet>
    getPetByIdFromDB: (petId: string) => Promise<Pet | undefined>
    patchPetFromDB: (petId: string, data: PetPatchIn) => Promise<Pet | undefined>
  }
}

export function controller({ repo }: RepositoryType) {
  const { getCurrentPetFromDB, getPetByIdFromDB, patchPetFromDB } = repo

  const getCurrentPet = async (_req: Request, res: Response) => {
    const pet = await getCurrentPetFromDB()
    return res.status(HttpStatus.OK).json({ pet })
  }

  const getPetById = async (req: Request<{ id: string }>, res: Response) => {
    const petId = req.params.id
    const pet = await getPetByIdFromDB(petId)

    if (!pet) {
      return res.status(HttpStatus.NOT_FOUND).json({ error: 'Not found' })
    }

    return res.status(HttpStatus.OK).json({ pet })
  }

  const patchPet = async (
    req: Request<{ id: string }, Record<string, unknown>, PetPatchIn>,
    res: Response
  ) => {
    const petId = req.params.id
    const patchData = req.body

    const pet = await patchPetFromDB(petId, patchData)
    if (!pet) {
      return res.status(HttpStatus.NOT_FOUND).json({ error: 'Not found' })
    }

    return res.status(HttpStatus.OK).json({ pet })
  }

  return {
    getCurrentPet,
    getPetById,
    patchPet,
  }
}
