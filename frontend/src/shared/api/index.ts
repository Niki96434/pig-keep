import { notesApi } from './notesApi'
import { tagsApi } from './tagsApi'

export { axiosInstance } from './axiosInstance'
export { queryClient } from './queryClient'
export { notesApi, type GetNotesParams } from './notesApi'
export { tagsApi } from './tagsApi'

export const api = {
  notes: notesApi,
  tags: tagsApi,
}
