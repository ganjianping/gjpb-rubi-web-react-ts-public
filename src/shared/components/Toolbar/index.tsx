import { useState, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '@/shared/ui/ThemeToggle'
import ThemeColorPicker from '@/shared/ui/ThemeColorPicker'
import LanguageToggle from '@/shared/ui/LanguageToggle'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'

// Define Icons
const Icons = {
  Learning: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  Chat: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  FileText: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Newspaper: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  ),
  Media: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Image: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  Video: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  Audio: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
  Question: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  CheckSquare: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  Edit: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Clipboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  ),
  Toggle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="5" width="22" height="14" rx="7" ry="7" />
      <circle cx="16" cy="12" r="3" />
    </svg>
  )
}

interface MenuItem {
  nameKey: string
  path: string
  icon: ReactNode
}

interface MenuGroup {
  titleKey: string
  icon: ReactNode
  items: MenuItem[]
}

const menuGroups: MenuGroup[] = [
  {
    titleKey: 'learningContent',
    icon: <Icons.Learning />,
    items: [
      { nameKey: 'vocabularies', path: '/vocabularies', icon: <Icons.Learning /> },
      { nameKey: 'expressions', path: '/expressions', icon: <Icons.Chat /> },
      { nameKey: 'sentences', path: '/sentences', icon: <Icons.FileText /> },
      { nameKey: 'articles', path: '/articles', icon: <Icons.Newspaper /> },
    ]
  },
  {
    titleKey: 'media',
    icon: <Icons.Media />,
    items: [
      { nameKey: 'images', path: '/images', icon: <Icons.Image /> },
      { nameKey: 'videos', path: '/videos', icon: <Icons.Video /> },
      { nameKey: 'audios', path: '/audios', icon: <Icons.Audio /> },
    ]
  },
  {
    titleKey: 'questions',
    icon: <Icons.Question />,
    items: [
      { nameKey: 'multipleChoice', path: '/questions/multiple-choice', icon: <Icons.CheckSquare /> },
      { nameKey: 'freeText', path: '/questions/free-text', icon: <Icons.Edit /> },
      { nameKey: 'fillBlanks', path: '/questions/fill-blank', icon: <Icons.Clipboard /> },
      { nameKey: 'trueFalse', path: '/questions/true-false', icon: <Icons.Toggle /> },
    ]
  }
]

function Toolbar() {
  const { language } = useAppSettings()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    setOpenGroup(null)
  }

  const toggleGroup = (groupTitle: string) => {
    setOpenGroup(openGroup === groupTitle ? null : groupTitle)
  }

  const handleMouseEnter = (groupTitle: string) => {
    setOpenGroup(groupTitle)
  }

  const handleMouseLeave = () => {
    setTimeout(() => {
      setOpenGroup(null)
    }, 150)
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {/* Hamburger menu button for mobile */}
      <button
        onClick={toggleMenu}
        style={{
          display: 'none',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '0.5rem',
          cursor: 'pointer',
          fontSize: '1.5rem',
          color: 'var(--text-primary)',
          transition: 'all 0.2s ease'
        }}
        className="mobile-menu-btn"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>

      {/* Desktop navigation */}
      <nav 
        style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}
        className="desktop-nav"
      >
        {menuGroups.map((group) => (
          <div 
            key={group.titleKey} 
            style={{ position: 'relative' }}
            onMouseEnter={() => handleMouseEnter(group.titleKey)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              style={{
                background: openGroup === group.titleKey 
                  ? 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-hover) 100%)' 
                  : 'var(--bg-secondary)',
                border: openGroup === group.titleKey ? 'none' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '0.625rem 1rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: openGroup === group.titleKey ? '#fff' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                whiteSpace: 'nowrap',
                boxShadow: openGroup === group.titleKey ? 'var(--shadow-md)' : 'none',
                transform: openGroup === group.titleKey ? 'translateY(-1px)' : 'translateY(0)'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{group.icon}</span>
              <span>{t(group.titleKey, language)}</span>
              <span style={{ 
                fontSize: '0.65rem',
                transition: 'transform 0.3s ease',
                transform: openGroup === group.titleKey ? 'rotate(180deg)' : 'rotate(0deg)',
                display: 'inline-block'
              }}>▼</span>
            </button>

            {/* Dropdown menu with enhanced stability */}
            {openGroup === group.titleKey && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  paddingTop: '0.5rem',
                  zIndex: 1000
                }}
              >
                <div
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    minWidth: '220px',
                    overflow: 'hidden',
                    animation: 'slideDown 0.2s ease-out'
                  }}
                >
                  {group.items.map((item, index) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.875rem',
                        padding: '0.875rem 1.25rem',
                        color: hoveredItem === item.path ? 'var(--primary-color)' : 'var(--text-primary)',
                        textDecoration: 'none',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderBottom: index < group.items.length - 1 ? '1px solid var(--border-color-light)' : 'none',
                        background: hoveredItem === item.path ? 'var(--bg-secondary)' : 'transparent',
                        fontSize: '0.9375rem',
                        fontWeight: '500'
                      }}
                      onMouseEnter={() => setHoveredItem(item.path)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <span style={{ 
                        fontSize: '1.375rem',
                        transition: 'transform 0.2s ease',
                        transform: hoveredItem === item.path ? 'scale(1.1)' : 'scale(1)',
                        display: 'inline-block'
                      }}>{item.icon}</span>
                      <span style={{
                        flex: 1,
                        transition: 'transform 0.2s ease',
                        transform: hoveredItem === item.path ? 'translateX(4px)' : 'translateX(0)'
                      }}>{t(item.nameKey, language)}</span>
                      {hoveredItem === item.path && (
                        <span style={{ 
                          fontSize: '0.75rem',
                          opacity: 0.6
                        }}>→</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--bg-elevated)',
            zIndex: 999,
            overflowY: 'auto',
            padding: '1rem',
            display: 'none'
          }}
          className="mobile-nav"
        >
          {menuGroups.map((group) => (
            <div key={group.titleKey} style={{ marginBottom: '1rem' }}>
              <button
                onClick={() => toggleGroup(group.titleKey)}
                style={{
                  width: '100%',
                  background: openGroup === group.titleKey ? 'var(--primary-color)' : 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '1rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: openGroup === group.titleKey ? '#fff' : 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{group.icon}</span>
                  <span>{t(group.titleKey, language)}</span>
                </span>
                <span style={{ fontSize: '1rem' }}>
                  {openGroup === group.titleKey ? '▲' : '▼'}
                </span>
              </button>

              {openGroup === group.titleKey && (
                <div style={{ marginTop: '0.5rem', paddingLeft: '0.5rem' }}>
                  {group.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={toggleMenu}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem',
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        background: 'var(--bg-secondary)',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                      <span style={{ fontSize: '1rem' }}>{t(item.nameKey, language)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Settings controls */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        marginLeft: '0.5rem',
        paddingLeft: '0.5rem',
        borderLeft: '1px solid var(--border-color)'
      }}>
        <ThemeToggle />
        <ThemeColorPicker />
        <LanguageToggle />
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav {
            display: block !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Toolbar
