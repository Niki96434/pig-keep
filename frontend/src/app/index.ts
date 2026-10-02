import { createElement } from 'react'
import { App as AppContent } from './App'
import { Providers } from './providers'

export function App() {
  return createElement(Providers, null, createElement(AppContent, null))
}

export { Providers }
