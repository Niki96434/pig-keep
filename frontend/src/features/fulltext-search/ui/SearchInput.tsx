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
  const { value, setSearchValue } = useSearchStore()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const changedValue = e.target.value
    setSearchValue(changedValue)
  }

  const handleClear = () => {
    setSearchValue('')
  }

  return (
    <InputGroup
      className={cn(
        'w-full h-10 lg:w-180 lg:h-12.5 rounded-md shadow-sm border-transparent focus-within:border-transparent focus-within:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-transparent has-[[data-slot=input-group-control]:focus-visible]:ring-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0'
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
          size={'sm'}
          onClick={handleClear}
          className="rounded-md outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:border-transparent focus-visible:ring-transparent"
        >
          <X />
        </InputGroupButton>
      ) : null}
    </InputGroup>
  )
}

export default SearchInput
