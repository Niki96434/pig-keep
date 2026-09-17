import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { render } from '@testing-library/react'
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
