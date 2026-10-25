export interface defaultStateType {
  value: string | null
}

export interface SearchActionsType {
  setSearchValue: (search: string) => void
  setClearSearch: () => void
}

export interface SearchStoreType extends defaultStateType {
  actions: SearchActionsType
}
