import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/shared/ui/search/input-group'
import { Search } from 'lucide-react'
import { X } from 'lucide-react'

function SearchInput() {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align={'inline-start'}>
        <Search />
      </InputGroupAddon>
      <InputGroupButton size={'sm'}>
        <X />
      </InputGroupButton>
    </InputGroup>
  )
}

export default SearchInput
