export interface EditNoteState {
  noteId: string | null
  isOpenEditForm: boolean
}

export interface EditNoteActions {
  setOpenEditForm: () => void
  setCloseEditForm: () => void
  // eslint-disable-next-line no-unused-vars
  setId: (id: string) => void
  removeId: () => void
}

export interface EditNoteStore extends EditNoteState {
  actions: EditNoteActions
}
