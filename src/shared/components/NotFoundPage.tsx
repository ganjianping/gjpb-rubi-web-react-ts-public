import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'

function NotFoundPage() {
  const error = useRouteError()
  const { language } = useAppSettings()

  let errorMessage: string
  let errorStatus: number | undefined

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || t('notFound', language)
    errorStatus = error.status
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  } else {
    errorMessage = t('unknownError', language)
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      textAlign: 'center',
      padding: '2rem',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    }}>
      <h1 style={{ 
        fontSize: '6rem', 
        margin: 0,
        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-light))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        {errorStatus || '404'}
      </h1>
      <h2 style={{ 
        fontSize: '2rem', 
        marginBottom: '1rem',
        color: 'var(--text-primary)'
      }}>
        {errorMessage}
      </h2>
      <p style={{ 
        fontSize: '1.2rem', 
        marginBottom: '2rem', 
        color: 'var(--text-secondary)'
      }}>
        {t('pageNotFoundDesc', language)}
      </p>
      <Link 
        to="/" 
        style={{ 
          padding: '0.8rem 1.5rem', 
          backgroundColor: 'var(--accent-primary)', 
          color: 'var(--text-inverse)', 
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '500',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        {t('goHome', language)}
      </Link>
    </div>
  )
}

export default NotFoundPage
