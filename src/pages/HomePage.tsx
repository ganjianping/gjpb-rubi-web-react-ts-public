import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { useUI } from '@/shared/contexts/UIContext'
import { t } from '@/shared/i18n'

function HomePage() {
  const { theme, themeColor } = useUI()
  const { language, getSettingValue, isLoading } = useAppSettings()

  if (isLoading) {
    return <div>{t('loadingAppSettings', language)}</div>
  }

  const appVersion = getSettingValue('app_version')

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        {t('welcomeTitle', language)}
      </h1>
      
      <div style={{ 
        padding: '2rem', 
        borderRadius: '8px', 
        backgroundColor: theme === 'light' ? '#f5f5f5' : '#333',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>{t('currentSettings', language)}</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '0.5rem 0' }}>
            <strong>{t('theme', language)}:</strong> {t(theme, language)}
          </li>
          <li style={{ padding: '0.5rem 0' }}>
            <strong>{t('themeColor', language)}:</strong> {themeColor}
          </li>
          <li style={{ padding: '0.5rem 0' }}>
            <strong>{t('language', language)}:</strong> {language}
          </li>
          <li style={{ padding: '0.5rem 0' }}>
            <strong>{t('appVersion', language)}:</strong> {appVersion}
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>{t('features', language)}</h2>
        <ul>
          <li>✅ {t('feature1', language)}</li>
          <li>✅ {t('feature2', language)}</li>
          <li>✅ {t('feature3', language)}</li>
          <li>✅ {t('feature4', language)}</li>
          <li>✅ {t('feature5', language)}</li>
          <li>✅ {t('feature6', language)}</li>
          <li>✅ {t('feature7', language)}</li>
          <li>✅ {t('feature8', language)}</li>
          <li>✅ {t('feature9', language)}</li>
          <li>✅ {t('feature10', language)}</li>
        </ul>
      </div>

      <div>
        <h2 style={{ marginBottom: '1rem' }}>{t('gettingStarted', language)}</h2>
        <p>
          {t('gettingStartedDesc', language)}
        </p>
      </div>
    </div>
  )
}

export default HomePage
