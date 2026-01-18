import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'

function Footer() {
  const { getSettingValue, language } = useAppSettings()
  const appVersion = getSettingValue('app_version') || '1.0.0'

  return (
    <footer style={{ 
      padding: '1rem', 
      borderTop: '1px solid #ccc', 
      textAlign: 'center',
      marginTop: 'auto'
    }}>
      <p>© {new Date().getFullYear()} Rubi Learning | {t('version', language)}: {appVersion}</p>
    </footer>
  )
}

export default Footer
