import { Link, Outlet } from 'react-router-dom'
import Footer from '@/shared/components/Footer'
import Toolbar from '@/shared/components/Toolbar'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import rubiLogo from '@/assets/rubi-logo.jpg'

function PublicLayout() {
  const { language } = useAppSettings()

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
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem' 
          }}>
            <Link 
              to="/" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <img 
                src={rubiLogo} 
                alt="Rubi Logo" 
                style={{ 
                  height: '40px',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer'
                }} 
              />
              <span style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: 'var(--text-primary)',
                transition: 'color 0.3s ease',
                cursor: 'pointer'
              }}>
                {t('studyHub', language)}
              </span>
            </Link>
          </div>
          <Toolbar />
        </div>
      </header>
      
      <main style={{ 
        flex: 1, 
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
