import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import '@fontsource/anton/400.css'
import '@fontsource-variable/manrope'
import './index.css'
import './styles/index.css'
import App from './App'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root container not found')
}

createRoot(container).render(
  <StrictMode>
    <>
      <App />
      <Analytics />
    </>
  </StrictMode>,
)
