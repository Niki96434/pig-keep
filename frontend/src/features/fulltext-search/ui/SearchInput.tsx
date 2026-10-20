import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/shared/ui'
import { Search, X } from 'lucide-react'
import { cn } from '@/shared/utils'
import { useSearchStore } from '@/stores/fulltext-search/searchStore'
import type { ChangeEvent } from 'react'

export function SearchInput() {
  const value = useSearchStore((state) => state.value)
  const actions = useSearchStore((state) => state.actions)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    actions.setSearchValue(e.target.value)
  }

  const handleClear = () => {
    actions.setClearSearch()
  }

  return (
    <InputGroup
      className={cn(
        'relative flex items-center w-full h-11 md:h-12 px-3 rounded-xl',
        'bg-[#efefef] hover:bg-[#e2e2e2] focus-within:bg-[#e2e2e2] transition-colors duration-200',
        'has-[[data-slot=input-group-control]:focus-visible]:border-transparent has-[[data-slot=input-group-control]:focus-visible]:ring-0 outline-none focus:outline-none focus:ring-0'
      )}
    >
      <InputGroupAddon
        align={'inline-start'}
        className="pl-1 text-muted-foreground pointer-events-none"
      >
        <Search className="size-5 shrink-0" />
      </InputGroupAddon>
      <InputGroupInput
        placeholder="Поиск"
        value={value ?? ''}
        onChange={handleChange}
        className="h-full text-base bg-transparent border-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 placeholder:text-muted-foreground placeholder:text-base"
      />
      {typeof value === 'string' && value.length > 0 ? (
        <InputGroupButton
          size={'icon-sm'}
          onClick={handleClear}
          aria-label="Очистить поиск"
          className="cursor-pointer rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <X className="size-4" />
        </InputGroupButton>
      ) : null}
    </InputGroup>
  )
}
