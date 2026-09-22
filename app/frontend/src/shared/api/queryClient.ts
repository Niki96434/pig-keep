import { QueryClient } from '@tanstack/react-query'

const CACHE_TIME_MS = 1000 * 60 * 30

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: CACHE_TIME_MS,
      refetchOnWindowFocus: false,
      gcTime: CACHE_TIME_MS,
    },
  },
})
