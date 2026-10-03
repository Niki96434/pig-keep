import { create } from 'zustand'

interface TagsModalState {
  isOpen: boolean
}

interface TagsModalStore extends TagsModalState {
  open: () => void
  close: () => void
}

export const useTagsModalStore = create<TagsModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
