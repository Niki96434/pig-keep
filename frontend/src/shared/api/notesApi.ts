import { axiosInstance } from './axiosInstance'
import type {
  Note,
  NotesGetOut,
  NoteGetByIdOut,
  NoteCreateIn,
  NoteCreateOut,
  NotePutIn,
  NotePatchIn,
  NoteUpdateOut,
} from '@shared/notes/types'

export const notesApi = {
  /**
   * Получить список всех заметок
   */
  getNotes: async (): Promise<NotesGetOut> => {
    const res = await axiosInstance.get<NotesGetOut>('/api/v1/notes')
    return res.data
  },

  /**
   * Получить заметку по идентификатору
   */
  getNoteById: async (id: Note['id']): Promise<NoteGetByIdOut> => {
    const res = await axiosInstance.get<NoteGetByIdOut>(`/api/v1/notes/${id}`)
    return res.data
  },

  /**
   * Создать новую заметку
   */
  createNote: async (data: NoteCreateIn): Promise<{ note: NoteCreateOut }> => {
    const res = await axiosInstance.post<{ note: NoteCreateOut }>('/api/v1/notes', data)
    return res.data
  },

  /**
   * Полностью обновить заметку (PUT)
   */
  updateNote: async (id: Note['id'], data: NotePutIn): Promise<{ note: NoteUpdateOut }> => {
    const res = await axiosInstance.put<{ note: NoteUpdateOut }>(`/api/v1/notes/${id}`, data)
    return res.data
  },

  /**
   * Частично обновить заметку (PATCH)
   */
  patchNote: async (id: Note['id'], data: NotePatchIn): Promise<{ note: NoteUpdateOut }> => {
    const res = await axiosInstance.patch<{ note: NoteUpdateOut }>(`/api/v1/notes/${id}`, data)
    return res.data
  },

  /**
   * Удалить заметку по ID
   */
  deleteNote: async (id: Note['id']): Promise<{ message: string }> => {
    const res = await axiosInstance.delete<{ message: string }>(`/api/v1/notes/${id}`)
    return res.data
  },
}

export const api = {
  notes: notesApi,
}
