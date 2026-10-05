import { axiosInstance } from './axiosInstance'
import type { PetGetOut, PetPatchIn } from '@shared/pets/types'

export const petsApi = {
  getCurrentPet: async (): Promise<PetGetOut> => {
    const res = await axiosInstance.get<PetGetOut>('/api/v1/pets')
    return res.data
  },

  getPetById: async (id: string): Promise<PetGetOut> => {
    const res = await axiosInstance.get<PetGetOut>(`/api/v1/pets/${id}`)
    return res.data
  },

  patchPet: async (id: string, data: PetPatchIn): Promise<PetGetOut> => {
    const res = await axiosInstance.patch<PetGetOut>(`/api/v1/pets/${id}`, data)
    return res.data
  },
}
