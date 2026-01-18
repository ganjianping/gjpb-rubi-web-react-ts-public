import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { useUI } from '@/shared/contexts/UIContext'
import { t } from '@/shared/i18n'

function HomePage() {
  const { theme, themeColor } = useUI()
  const { language, getSettingValue, isLoading } = useAppSettings()

  if (isLoading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem',
        color: 'var(--text-secondary)'
      }}>
        {t('loadingAppSettings', language)}
      </div>
    )
  }

  const appVersion = getSettingValue('app_version')

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto'
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '1rem',
        color: 'var(--text-primary)',
        fontWeight: '700'
      }}>
        {t('welcomeTitle', language)}
      </h1>
      
      <div style={{ 
        padding: '2rem', 
        borderRadius: '12px', 
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-md)',
        transition: 'all 0.3s ease'
      }}>
        <h2 style={{ 
          marginBottom: '1.5rem',
          color: 'var(--text-primary)',
          borderBottom: '2px solid var(--accent-primary)',
          paddingBottom: '0.5rem',
          display: 'inline-block'
        }}>
          {t('currentSettings', language)}
        </h2>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0,
          display: 'grid',
          gap: '1rem'
        }}>
          <li style={{ 
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            borderLeft: '3px solid var(--accent-primary)',
            transition: 'transform 0.2s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
          >
            <strong style={{ color: 'var(--text-primary)' }}>{t('theme', language)}:</strong>{' '}
            <span style={{ color: 'var(--text-secondary)' }}>{t(theme, language)}</span>
          </li>
          <li style={{ 
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            borderLeft: '3px solid var(--accent-primary)',
            transition: 'transform 0.2s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
          >
            <strong style={{ color: 'var(--text-primary)' }}>{t('themeColor', language)}:</strong>{' '}
            <span style={{ color: 'var(--text-secondary)' }}>{themeColor}</span>
          </li>
          <li style={{ 
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            borderLeft: '3px solid var(--accent-primary)',
            transition: 'transform 0.2s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
          >
            <strong style={{ color: 'var(--text-primary)' }}>{t('language', language)}:</strong>{' '}
            <span style={{ color: 'var(--text-secondary)' }}>{language}</span>
          </li>
          <li style={{ 
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            borderLeft: '3px solid var(--accent-primary)',
            transition: 'transform 0.2s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
          >
            <strong style={{ color: 'var(--text-primary)' }}>{t('appVersion', language)}:</strong>{' '}
            <span style={{ color: 'var(--text-secondary)' }}>{appVersion}</span>
          </li>
        </ul>
      </div>

      <div style={{ 
        marginBottom: '2rem',
        padding: '2rem',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-md)',
        transition: 'all 0.3s ease'
      }}>
        <h2 style={{ 
          marginBottom: '1.5rem',
          color: 'var(--text-primary)',
          borderBottom: '2px solid var(--accent-primary)',
          paddingBottom: '0.5rem',
          display: 'inline-block'
        }}>
          {t('features', language)}
        </h2>
        <ul style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '0.75rem',
          listStyle: 'none',
          padding: 0
        }}>
          <li style={{ 
            padding: '0.5rem',
            color: 'var(--text-secondary)'
          }}>✅ {t('feature1', language)}</li>
          <li style={{ 
            padding: '0.5rem',
            color: 'var(--text-secondary)'
          }}>✅ {t('feature2', language)}</li>
          <li style={{ 
            padding: '0.5rem',
            color: 'var(--text-secondary)'
          }}>✅ {t('feature3', language)}</li>
          <li style={{ 
            padding: '0.5rem',
            color: 'var(--text-secondary)'
          }}>✅ {t('feature4', language)}</li>
          <li style={{ 
            padding: '0.5rem',
            color: 'var(--text-secondary)'
          }}>✅ {t('feature5', language)}</li>
          <li style={{ 
            padding: '0.5rem',
            color: 'var(--text-secondary)'
          }}>✅ {t('feature6', language)}</li>
          <li style={{ 
            padding: '0.5rem',
            color: 'var(--text-secondary)'
          }}>✅ {t('feature7', language)}</li>
          <li style={{ 
            padding: '0.5rem',
            color: 'var(--text-secondary)'
          }}>✅ {t('feature8', language)}</li>
          <li style={{ 
            padding: '0.5rem',
            color: 'var(--text-secondary)'
          }}>✅ {t('feature9', language)}</li>
          <li style={{ 
            padding: '0.5rem',
            color: 'var(--text-secondary)'
          }}>✅ {t('feature10', language)}</li>
        </ul>
      </div>

      <div style={{
        padding: '2rem',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-md)',
        transition: 'all 0.3s ease'
      }}>
        <h2 style={{ 
          marginBottom: '1rem',
          color: 'var(--text-primary)',
          borderBottom: '2px solid var(--accent-primary)',
          paddingBottom: '0.5rem',
          display: 'inline-block'
        }}>
          {t('gettingStarted', language)}
        </h2>
        <p style={{ 
          color: 'var(--text-secondary)',
          lineHeight: '1.6'
        }}>
          {t('gettingStartedDesc', language)}
        </p>
      </div>
    </div>
  )
}

export default HomePage
