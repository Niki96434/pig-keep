export interface defaultStateType {
  value: string | null
}

export interface SearchStoreType extends defaultStateType {
  setSearchValue: (search: string) => void
}
