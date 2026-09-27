import { create } from 'zustand'
import type { defaultStateType, SearchStoreType } from './types'

const defaultState: defaultStateType = {
  value: null,
}

export const useSearchStore = create<SearchStoreType>((set) => ({
  ...defaultState,
  setSearchValue: (search: string) => set({ value: search }),
}))
