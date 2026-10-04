import express from 'express'
import { db } from '../../core/db/'
import { validateSchemas } from '../../core/middlewares/validateSchemas'
import {
  PetIdSchema,
  PetPatchInSchema,
} from '@app/shared/pets/validationSchemas'
import { controller } from './controller'
import { repository } from './repository'

export const petsRouter = express.Router()

const repo = repository({ db })
const { getCurrentPet, getPetById, patchPet } = controller({ repo })

petsRouter.get('/', getCurrentPet)
petsRouter.get('/current', getCurrentPet)

petsRouter
  .route('/:id')
  .get(validateSchemas({ params: PetIdSchema }), getPetById)
  .patch(
    validateSchemas({ params: PetIdSchema, body: PetPatchInSchema }),
    patchPet
  )
