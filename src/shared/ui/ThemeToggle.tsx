import { useUI } from '@/shared/contexts/UIContext'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'

function ThemeToggle() {
  const { theme, toggleTheme } = useUI()
  const { language } = useAppSettings()
  const nextTheme = theme === 'light' ? 'dark' : 'light'

  return (
    <button 
      onClick={toggleTheme}
      title={`${t('theme', language)}: ${t(nextTheme, language)}`}
      style={{
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        border: '1px solid #ccc',
        cursor: 'pointer',
        backgroundColor: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#000' : '#fff'
      }}
    >
      {theme === 'light' ? `🌙 ${t('dark', language)}` : `☀️ ${t('light', language)}`}
    </button>
  )
}

export default ThemeToggle
