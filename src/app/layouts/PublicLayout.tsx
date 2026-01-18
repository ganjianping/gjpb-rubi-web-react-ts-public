import { Outlet } from 'react-router-dom'
import Footer from '@/shared/components/Footer'
import Toolbar from '@/shared/components/Toolbar'
import rubiLogo from '@/assets/rubi-logo.jpg'

function PublicLayout() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      <header style={{ 
        padding: '1rem', 
        borderBottom: '1px solid var(--header-border)',
        backgroundColor: 'var(--bg-elevated)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <img 
            src={rubiLogo} 
            alt="Rubi Logo" 
            style={{ 
              height: '40px',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-sm)'
            }} 
          />
          <Toolbar />
        </div>
      </header>
      
      <main style={{ 
        flex: 1, 
        padding: '2rem',
        backgroundColor: 'var(--bg-primary)',
        transition: 'background-color 0.3s ease'
      }}>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  )
}

export default PublicLayout
