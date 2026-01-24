import { Link } from 'react-router-dom'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import './DashboardPage.css'

interface PageShortcut {
  path: string
  icon: string
  label: string
  description: string
  category: string
}

function DashboardPage() {
  const { language } = useAppSettings()

  const pageShortcuts: PageShortcut[] = [
    // Learning Content
    {
      path: '/vocabularies',
      icon: '📚',
      label: t('vocabularies', language),
      description: t('vocabulariesDesc', language) || 'Learn new words and expand your vocabulary',
      category: 'learning'
    },
    {
      path: '/expressions',
      icon: '💬',
      label: t('expressions', language),
      description: t('expressionsDesc', language) || 'Master common phrases and expressions',
      category: 'learning'
    },
    {
      path: '/sentences',
      icon: '📝',
      label: t('sentences', language),
      description: t('sentencesDesc', language) || 'Practice with example sentences',
      category: 'learning'
    },
    {
      path: '/articles',
      icon: '📰',
      label: t('articles', language),
      description: t('articlesDesc', language) || 'Read articles to improve comprehension',
      category: 'learning'
    },
    // Media
    {
      path: '/images',
      icon: '🖼️',
      label: t('images', language),
      description: t('imagesDesc', language) || 'Visual learning with images',
      category: 'media'
    },
    {
      path: '/videos',
      icon: '🎥',
      label: t('videos', language),
      description: t('videosDesc', language) || 'Watch educational videos',
      category: 'media'
    },
    {
      path: '/audios',
      icon: '🎧',
      label: t('audios', language),
      description: t('audiosDesc', language) || 'Listen to audio materials',
      category: 'media'
    },
    // Questions
    {
      path: '/questions/multiple-choice',
      icon: '✅',
      label: t('multipleChoice', language),
      description: t('multipleChoiceDesc', language) || 'Test your knowledge with multiple choice questions',
      category: 'questions'
    },
    {
      path: '/questions/free-text',
      icon: '✍️',
      label: t('freeText', language),
      description: t('freeTextDesc', language) || 'Practice writing with free text questions',
      category: 'questions'
    },
    {
      path: '/questions/fill-blank',
      icon: '📋',
      label: t('fillBlank', language),
      description: t('fillBlankDesc', language) || 'Fill in the blanks exercises',
      category: 'questions'
    },
    {
      path: '/questions/true-false',
      icon: '🔀',
      label: t('trueFalse', language),
      description: t('trueFalseDesc', language) || 'True or false questions',
      category: 'questions'
    }
  ]

  const categories = {
    learning: { title: t('learningContent', language) || 'Learning Content', icon: '📖' },
    media: { title: t('mediaResources', language) || 'Media Resources', icon: '🎬' },
    questions: { title: t('practiceQuestions', language) || 'Practice Questions', icon: '❓' }
  }

  const groupedShortcuts = {
    learning: pageShortcuts.filter(s => s.category === 'learning'),
    media: pageShortcuts.filter(s => s.category === 'media'),
    questions: pageShortcuts.filter(s => s.category === 'questions')
  }

  return (
    <div className="dashboard-page">
      
      {Object.entries(groupedShortcuts).map(([categoryKey, shortcuts]) => (
        <section key={categoryKey} className="dashboard-category">
          <h2 className="category-title">
            <span className="category-icon">{categories[categoryKey as keyof typeof categories].icon}</span>
            {categories[categoryKey as keyof typeof categories].title}
          </h2>
          <div className="shortcuts-grid">
            {shortcuts.map((shortcut) => (
              <Link
                key={shortcut.path}
                to={shortcut.path}
                className="shortcut-card"
              >
                <div className="shortcut-icon">{shortcut.icon}</div>
                <div className="shortcut-content">
                  <h3 className="shortcut-label">{shortcut.label}</h3>
                  <p className="shortcut-description">{shortcut.description}</p>
                </div>
                <div className="shortcut-arrow">→</div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default DashboardPage
