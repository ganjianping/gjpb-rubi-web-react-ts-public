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

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <span style={{ fontSize: '0.9rem' }}>{t('color', language)}:</span>
      {colors.map(({ name, value, i18nKey }) => (
        <button
          key={name}
          onClick={() => setThemeColor(name)}
          title={t(i18nKey, language)}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: themeColor === name ? '3px solid #000' : '2px solid #ccc',
            backgroundColor: value,
            cursor: 'pointer',
            padding: 0,
          }}
          aria-label={t(i18nKey, language)}
        />
      ))}
    </div>
  )
}

export default ThemeColorPicker
