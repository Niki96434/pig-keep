import { api } from '@/shared/api'
import type { PetGetOut } from '@shared/pets/types'
import { useQuery } from '@tanstack/react-query'

export const PET_QUERY_KEY = ['pet', 'current'] as const

export const useGetPetQuery = () => {
  return useQuery<PetGetOut>({
    queryKey: PET_QUERY_KEY,
    queryFn: () => api.pets.getCurrentPet(),
    staleTime: 1000 * 30,
  })
}
