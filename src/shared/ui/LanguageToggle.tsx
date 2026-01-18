import { useAppSettings } from '@/shared/contexts/AppSettingsContext'

function LanguageToggle() {
  const { language, setLanguage } = useAppSettings()

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'ZH' : 'EN')
  }

  return (
    <button
      onClick={toggleLanguage}
      title={language === 'EN' ? 'Switch to 中文' : 'Switch to English'}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '1px solid var(--border-primary)',
        cursor: 'pointer',
        backgroundColor: 'var(--button-bg)',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        position: 'relative',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="var(--accent-primary)" strokeWidth="2" fill="none"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="var(--accent-primary)" strokeWidth="2" fill="none"/>
      </svg>
      <div style={{
        position: 'absolute',
        bottom: '-2px',
        right: '-2px',
        backgroundColor: 'var(--accent-primary)',
        color: 'var(--text-inverse)',
        borderRadius: '50%',
        width: '16px',
        height: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 'bold',
        border: '1px solid var(--bg-elevated)'
      }}>
        {language === 'EN' ? 'EN' : '中'}
      </div>
    </button>
  )
}

export default LanguageToggle
