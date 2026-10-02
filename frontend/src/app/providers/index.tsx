import { StrictMode, type ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/shared/api'
import { SidebarInset, TooltipProvider } from '@/shared/ui'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SidebarInset>{children}</SidebarInset>
        </TooltipProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
