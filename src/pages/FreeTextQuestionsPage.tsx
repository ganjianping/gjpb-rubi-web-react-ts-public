import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'

function FreeTextQuestionsPage() {
  const { language } = useAppSettings()
  
  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto',
      padding: '2rem'
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '1rem',
        color: 'var(--text-primary)'
      }}>
        ✍️ {t('freeText', language)}
      </h1>
      <p style={{ 
        fontSize: '1.1rem', 
        color: 'var(--text-secondary)',
        lineHeight: '1.6'
      }}>
        {t('freeTextDesc', language)}
      </p>
    </div>
  )
}

export default FreeTextQuestionsPage
