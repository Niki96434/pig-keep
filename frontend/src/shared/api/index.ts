import { notesApi } from './notesApi'
import { tagsApi } from './tagsApi'
import { petsApi } from './petsApi'

export { axiosInstance } from './axiosInstance'
export { queryClient } from './queryClient'
export { notesApi, type GetNotesParams } from './notesApi'
export { tagsApi } from './tagsApi'
export { petsApi } from './petsApi'

export const api = {
  notes: notesApi,
  tags: tagsApi,
  pets: petsApi,
}
