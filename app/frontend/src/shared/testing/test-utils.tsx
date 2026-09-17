import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { render, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

export const renderWithProviders = (ui: React.ReactElement) => {
  const user = userEvent.setup()
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  })
  return {
    user,
    ...render(
      <QueryClientProvider client={testQueryClient}>
        {<div data-testid="background">{ui}</div>}
      </QueryClientProvider>
    ),
  }
}

export function renderHookWithProviders<Result, Props = unknown>(hook: (props: Props) => Result) {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
  }

  return { queryClient: testQueryClient, ...renderHook((props: Props) => hook(props), { wrapper }) }
}
