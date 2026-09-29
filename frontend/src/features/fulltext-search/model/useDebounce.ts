import { useEffect, useState } from 'react'

export const useDebounce = (value?: string) => {
  const [search, setSearch] = useState<string | undefined>(undefined)

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setSearch(value)
    }, 300)

    return () => clearTimeout(timeoutID)
  }, [value])

  return { search }
}
