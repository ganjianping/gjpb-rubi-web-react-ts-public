import { useState, useRef, useEffect } from 'react'
import { useUI } from '@/shared/contexts/UIContext'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'

const colors = [
  { name: 'blue', value: '#646cff', i18nKey: 'blueTheme' },
  { name: 'green', value: '#10b981', i18nKey: 'greenTheme' },
  { name: 'purple', value: '#8b5cf6', i18nKey: 'purpleTheme' },
  { name: 'orange', value: '#f97316', i18nKey: 'orangeTheme' },
] as const

function ThemeColorPicker() {
  const { themeColor, setThemeColor } = useUI()
  const { language } = useAppSettings()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={t('color', language)}
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
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.61 0 1.09-.54 1-1.12-.12-.61-.45-1.42-.45-1.88 0-.59.48-1 1-1h1.18c2.76 0 5.27-2.24 5.27-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="var(--accent-primary)"/>
        </svg>
      </button>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '45px',
          right: '0',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-primary)',
          borderRadius: '8px',
          padding: '8px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minWidth: '150px'
        }}>
          {colors.map(({ name, value, i18nKey }) => (
            <button
              key={name}
              onClick={() => {
                setThemeColor(name)
                setIsOpen(false)
              }}
              title={t(i18nKey, language)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                border: themeColor === name ? `1px solid ${value}` : '1px solid transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: themeColor === name ? 'var(--bg-overlay)' : 'transparent',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                whiteSpace: 'nowrap',
                color: 'var(--text-primary)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-overlay)'
              }}
              onMouseLeave={(e) => {
                if (themeColor !== name) e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: value,
                border: '2px solid var(--border-primary)',
                boxShadow: 'var(--shadow-sm)'
              }} />
              <span style={{ fontSize: '14px' }}>{t(i18nKey, language)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ThemeColorPicker
