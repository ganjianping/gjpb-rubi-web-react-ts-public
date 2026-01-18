import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import NotFoundPage from '@/shared/components/NotFoundPage'
import HomePage from '@/pages/HomePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
], {
  basename: '/rubi/',
})
