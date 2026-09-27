export interface defaultStateType {
  value: string | null
}

export interface SearchStoreType extends defaultStateType {
  // eslint-disable-next-line no-unused-vars
  setSearchValue: (search: string) => void
}
