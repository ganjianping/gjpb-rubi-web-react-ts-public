import { useAppSettings } from '@/shared/contexts/AppSettingsContext'

function LanguageToggle() {
  const { language, setLanguage } = useAppSettings()

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button
        onClick={() => setLanguage('EN')}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          border: '1px solid #ccc',
          cursor: 'pointer',
          backgroundColor: language === 'EN' ? '#646cff' : 'transparent',
          color: language === 'EN' ? '#fff' : 'inherit',
        }}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('ZH')}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          border: '1px solid #ccc',
          cursor: 'pointer',
          backgroundColor: language === 'ZH' ? '#646cff' : 'transparent',
          color: language === 'ZH' ? '#fff' : 'inherit',
        }}
      >
        中文
      </button>
    </div>
  )
}

export default LanguageToggle
