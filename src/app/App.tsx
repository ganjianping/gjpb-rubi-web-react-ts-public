import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { UIProvider } from '@/shared/contexts/UIContext'
import { AppSettingsProvider } from '@/shared/contexts/AppSettingsContext'
import { router } from './routes'

function App() {
  return (
    <UIProvider>
      <AppSettingsProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </AppSettingsProvider>
    </UIProvider>
  )
}

export default App
