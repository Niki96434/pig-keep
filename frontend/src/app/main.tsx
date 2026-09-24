import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.css'
import { App } from './App.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/shared/api/queryClient.ts'

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <App />
    </StrictMode>
  </QueryClientProvider>
)
