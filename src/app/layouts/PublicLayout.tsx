import { Outlet } from 'react-router-dom'
import Footer from '@/shared/components/Footer'
import Toolbar from '@/shared/components/Toolbar'

function PublicLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Rubi Learning</h1>
          <Toolbar />
        </div>
      </header>
      
      <main style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  )
}

export default PublicLayout
