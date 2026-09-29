import { create } from 'zustand'
import type { defaultStateType, SearchStoreType } from './types'

const defaultState: defaultStateType = {
  value: null,
}

export const useSearchStore = create<SearchStoreType>((set) => ({
  ...defaultState,
  actions: {
    setSearchValue: (search: string) => set({ value: search }),
    setClearSearch: () => set({ value: null }),
  },
}))
