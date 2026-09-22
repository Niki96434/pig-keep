import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { render, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

export const renderWithProviders = (ui: React.ReactElement) => {
  const user = userEvent.setup()
  const testQueryClient = createTestQueryClient()
  return {
    user,
    ...render(
      <QueryClientProvider client={testQueryClient}>
        {<div data-testid="background">{ui}</div>}
      </QueryClientProvider>
    ),
  }
}

// eslint-disable-next-line no-unused-vars
export function renderHookWithProviders<Result, Props = unknown>(hook: (props: Props) => Result) {
  const testQueryClient = createTestQueryClient()

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
  }

  return { queryClient: testQueryClient, ...renderHook((props: Props) => hook(props), { wrapper }) }
}
