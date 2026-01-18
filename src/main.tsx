import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App'

// Disable StrictMode in development to prevent double API calls
const isDevelopment = import.meta.env.DEV

createRoot(document.getElementById('root')!).render(
  isDevelopment ? (
    <App />
  ) : (
    <StrictMode>
      <App />
    </StrictMode>
  ),
)
