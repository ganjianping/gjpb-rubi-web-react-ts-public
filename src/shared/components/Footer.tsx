import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'

function Footer() {
  const { getSettingValue, language } = useAppSettings()
  const appVersion = getSettingValue('app_version') || '1.0.0'

  return (
    <footer style={{ 
      padding: '1.5rem', 
      borderTop: '1px solid var(--footer-border)', 
      textAlign: 'center',
      marginTop: 'auto',
      backgroundColor: 'var(--bg-elevated)',
      color: 'var(--text-secondary)',
      transition: 'all 0.3s ease'
    }}>
      <p style={{ fontSize: '0.9rem' }}>
        © {new Date().getFullYear()} Rubi Study Hub | {t('version', language)}: {appVersion}
      </p>
    </footer>
  )
}

export default Footer
