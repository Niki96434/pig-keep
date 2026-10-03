import { useEffect, useState } from 'react'

export function useDebounce(value?: string, delay = 300) {
  const [search, setSearch] = useState<string | undefined>(undefined)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(value)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [value, delay])

  return { search }
}
