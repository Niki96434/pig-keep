export interface defaultStateType {
  value: string | null
}

export interface SearchActionsType {
  // eslint-disable-next-line no-unused-vars
  setSearchValue: (search: string) => void
  setClearSearch: () => void
}

export interface SearchStoreType extends defaultStateType {
  actions: SearchActionsType
}
