import { useUI } from '@/shared/contexts/UIContext'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import ThemeToggle from '@/shared/ui/ThemeToggle'
import ThemeColorPicker from '@/shared/ui/ThemeColorPicker'
import LanguageToggle from '@/shared/ui/LanguageToggle'

function Toolbar() {
  const { theme } = useUI()
  const { language } = useAppSettings()

  return (
    <div style={{ 
      display: 'flex', 
      gap: '1rem', 
      alignItems: 'center',
      padding: '0.5rem'
    }}>
      <div style={{ fontSize: '0.9rem', color: '#666' }}>
        {t('theme', language)}: {t(theme, language)} | {t('language', language)}: {language}
      </div>
      
      <ThemeToggle />
      <ThemeColorPicker />
      <LanguageToggle />
    </div>
  )
}

export default Toolbar
