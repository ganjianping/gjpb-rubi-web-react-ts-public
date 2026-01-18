import { useUI } from '@/shared/contexts/UIContext'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'

const colorMap = {
  blue: '#646cff',
  green: '#10b981',
  purple: '#8b5cf6',
  orange: '#f97316'
}

function ThemeToggle() {
  const { theme, toggleTheme, themeColor } = useUI()
  const { language } = useAppSettings()
  const nextTheme = theme === 'light' ? 'dark' : 'light'
  const accentColor = colorMap[themeColor]

  return (
    <button 
      onClick={toggleTheme}
      title={`${t('theme', language)}: ${t(nextTheme, language)}`}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: `1px solid ${accentColor}`,
        cursor: 'pointer',
        backgroundColor: theme === 'light' ? '#fff' : '#333',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease'
      }}
    >
      {theme === 'light' ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill={accentColor} stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5" fill={accentColor} stroke={accentColor} strokeWidth="2"/>
          <line x1="12" y1="1" x2="12" y2="3" stroke={accentColor} strokeWidth="2" strokeLinecap="round"/>
          <line x1="12" y1="21" x2="12" y2="23" stroke={accentColor} strokeWidth="2" strokeLinecap="round"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke={accentColor} strokeWidth="2" strokeLinecap="round"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={accentColor} strokeWidth="2" strokeLinecap="round"/>
          <line x1="1" y1="12" x2="3" y2="12" stroke={accentColor} strokeWidth="2" strokeLinecap="round"/>
          <line x1="21" y1="12" x2="23" y2="12" stroke={accentColor} strokeWidth="2" strokeLinecap="round"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke={accentColor} strokeWidth="2" strokeLinecap="round"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke={accentColor} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )}
    </button>
  )
}

export default ThemeToggle
