import { create } from 'zustand'

interface defaultStateType {
  value: string | null
}

const defaultState: defaultStateType = {
  value: null,
}

export const searchStore = create((set) => ({
  ...defaultState,
  setSearchValue: (search: string) => set({ value: search }),
}))
