import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/shared/ui/search/input-group'
import { Search, X } from 'lucide-react'
import { cn } from '@/shared/utils/utils'
import { useSearchStore } from '@/stores/fulltext-search/searchStore'
import type { ChangeEvent } from 'react'

function SearchInput() {
  const value = useSearchStore((state) => state.value)
  const actions = useSearchStore((state) => state.actions)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const changedValue = e.target.value
    actions.setSearchValue(changedValue)
  }

  const handleClear = () => {
    actions.setClearSearch()
  }

  return (
    <InputGroup
      className={cn(
        'px-2 w-full h-10 lg:w-180 lg:h-12.5 rounded-md shadow-sm border-transparent focus-within:border-transparent focus-within:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-transparent has-[[data-slot=input-group-control]:focus-visible]:ring-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0'
      )}
    >
      <InputGroupInput
        placeholder="Поиск"
        value={value ?? ''}
        onChange={handleChange}
        className="h-full border-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-transparent focus-visible:border-transparent focus-visible:ring-transparent"
      />
      <InputGroupAddon align={'inline-start'}>
        <Search />
      </InputGroupAddon>
      {typeof value === 'string' ? (
        <InputGroupButton
          size={'icon-sm'}
          onClick={handleClear}
          aria-label="Очистить поиск"
          className="cursor-pointer rounded-full hover:bg-gray-100 transition-colors outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:border-transparent focus-visible:ring-transparent"
        >
          <X />
        </InputGroupButton>
      ) : null}
    </InputGroup>
  )
}

export default SearchInput
