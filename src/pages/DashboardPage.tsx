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
      icon: 'vocabularies',
      label: t('vocabularies', language),
      description: t('vocabulariesDesc', language) || 'Learn new words and expand your vocabulary',
      category: 'learning'
    },
    {
      path: '/expressions',
      icon: 'expressions',
      label: t('expressions', language),
      description: t('expressionsDesc', language) || 'Master common phrases and expressions',
      category: 'learning'
    },
    {
      path: '/sentences',
      icon: 'sentences',
      label: t('sentences', language),
      description: t('sentencesDesc', language) || 'Practice with example sentences',
      category: 'learning'
    },
    {
      path: '/articles',
      icon: 'articles',
      label: t('articles', language),
      description: t('articlesDesc', language) || 'Read articles to improve comprehension',
      category: 'learning'
    },
    // Media
    {
      path: '/images',
      icon: 'images',
      label: t('images', language),
      description: t('imagesDesc', language) || 'Visual learning with images',
      category: 'media'
    },
    {
      path: '/videos',
      icon: 'videos',
      label: t('videos', language),
      description: t('videosDesc', language) || 'Watch educational videos',
      category: 'media'
    },
    {
      path: '/audios',
      icon: 'audios',
      label: t('audios', language),
      description: t('audiosDesc', language) || 'Listen to audio materials',
      category: 'media'
    },
    // Questions
    {
      path: '/questions/multiple-choice',
      icon: 'multiple-choice',
      label: t('multipleChoice', language),
      description: t('multipleChoiceDesc', language) || 'Test your knowledge with multiple choice questions',
      category: 'questions'
    },
    {
      path: '/questions/free-text',
      icon: 'free-text',
      label: t('freeText', language),
      description: t('freeTextDesc', language) || 'Practice writing with free text questions',
      category: 'questions'
    },
    {
      path: '/questions/fill-blank',
      icon: 'fill-blank',
      label: t('fillBlank', language),
      description: t('fillBlankDesc', language) || 'Fill in the blanks exercises',
      category: 'questions'
    },
    {
      path: '/questions/true-false',
      icon: 'true-false',
      label: t('trueFalse', language),
      description: t('trueFalseDesc', language) || 'True or false questions',
      category: 'questions'
    }
  ]

  const categories = {
    learning: { title: t('learningContent', language) || 'Learning Content', icon: 'learning' },
    media: { title: t('mediaResources', language) || 'Media Resources', icon: 'media' },
    questions: { title: t('practiceQuestions', language) || 'Practice Questions', icon: 'questions' }
  }

  const groupedShortcuts = {
    learning: pageShortcuts.filter(s => s.category === 'learning'),
    media: pageShortcuts.filter(s => s.category === 'media'),
    questions: pageShortcuts.filter(s => s.category === 'questions')
  }

  const renderIcon = (iconName: string) => {
    const iconProps = {
      className: 'shortcut-icon-svg',
      viewBox: '0 0 24 24',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg'
    }

    switch (iconName) {
      case 'learning':
        return (
          <svg {...iconProps}>
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'media':
        return (
          <svg {...iconProps}>
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
            <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
      case 'questions':
        return (
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      case 'vocabularies':
        return (
          <svg {...iconProps}>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 8H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 16H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'expressions':
        return (
          <svg {...iconProps}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="10" r="1" fill="currentColor"/>
            <circle cx="15" cy="10" r="1" fill="currentColor"/>
            <path d="M9 14h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      case 'sentences':
        return (
          <svg {...iconProps}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'articles':
        return (
          <svg {...iconProps}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="10" y1="9" x2="8" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      case 'images':
        return (
          <svg {...iconProps}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'videos':
        return (
          <svg {...iconProps}>
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
            <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
            <polygon points="23,7 16,12 23,17 23,7" fill="currentColor"/>
          </svg>
        )
      case 'audios':
        return (
          <svg {...iconProps}>
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 1v22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'multiple-choice':
        return (
          <svg {...iconProps}>
            <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 16H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 8H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="5" cy="8" r="1" fill="currentColor"/>
            <circle cx="5" cy="12" r="1" fill="currentColor"/>
            <circle cx="5" cy="16" r="1" fill="currentColor"/>
          </svg>
        )
      case 'free-text':
        return (
          <svg {...iconProps}>
            <path d="M12 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'fill-blank':
        return (
          <svg {...iconProps}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="8" y1="13" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="14" y1="13" x2="18" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="17" x2="12" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="14" y1="17" x2="18" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="9" x2="12" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="14" y1="9" x2="18" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      case 'true-false':
        return (
          <svg {...iconProps}>
            <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 16H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="5" cy="8" r="1" fill="currentColor"/>
            <circle cx="5" cy="12" r="1" fill="currentColor"/>
            <circle cx="5" cy="16" r="1" fill="currentColor"/>
            <path d="M17 8l-4 4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      default:
        return (
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
    }
  }

  return (
    <div className="dashboard-page">
      
      {Object.entries(groupedShortcuts).map(([categoryKey, shortcuts]) => (
        <section key={categoryKey} className="dashboard-category">
          <h2 className="category-title">
            <span className="category-icon">{renderIcon(categories[categoryKey as keyof typeof categories].icon)}</span>
            {categories[categoryKey as keyof typeof categories].title}
          </h2>
          <div className="shortcuts-grid">
            {shortcuts.map((shortcut) => (
              <Link
                key={shortcut.path}
                to={shortcut.path}
                className="shortcut-card"
              >
                <div className="shortcut-icon">{renderIcon(shortcut.icon)}</div>
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
