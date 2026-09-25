import { create } from 'zustand'
import { type EditNoteState, type EditNoteStore } from './types'

const defaultState: EditNoteState = {
  noteId: null,
  isOpenEditForm: false,
}

export const useEditNoteStore = create<EditNoteStore>()((set) => ({
  ...defaultState,
  actions: {
    setOpenEditForm: () => set({ isOpenEditForm: true }),
    setCloseEditForm: () => set({ isOpenEditForm: false }),
    setId: (id) => set({ noteId: id }),
    removeId: () => set({ noteId: null }),
  },
}))
