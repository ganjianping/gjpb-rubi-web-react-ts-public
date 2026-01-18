import { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '@/shared/ui/ThemeToggle'
import ThemeColorPicker from '@/shared/ui/ThemeColorPicker'
import LanguageToggle from '@/shared/ui/LanguageToggle'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'

interface MenuItem {
  nameKey: string
  path: string
  icon: string
}

interface MenuGroup {
  titleKey: string
  icon: string
  items: MenuItem[]
}

const menuGroups: MenuGroup[] = [
  {
    titleKey: 'learningContent',
    icon: '📚',
    items: [
      { nameKey: 'vocabularies', path: '/vocabularies', icon: '📚' },
      { nameKey: 'expressions', path: '/expressions', icon: '💬' },
      { nameKey: 'sentences', path: '/sentences', icon: '📝' },
      { nameKey: 'articles', path: '/articles', icon: '📰' },
    ]
  },
  {
    titleKey: 'media',
    icon: '🎨',
    items: [
      { nameKey: 'images', path: '/images', icon: '🖼️' },
      { nameKey: 'videos', path: '/videos', icon: '🎬' },
      { nameKey: 'audios', path: '/audios', icon: '🎧' },
    ]
  },
  {
    titleKey: 'questions',
    icon: '❓',
    items: [
      { nameKey: 'multipleChoice', path: '/questions/multiple-choice', icon: '✅' },
      { nameKey: 'freeText', path: '/questions/free-text', icon: '✍️' },
      { nameKey: 'fillBlanks', path: '/questions/fill-blank', icon: '📋' },
      { nameKey: 'trueFalse', path: '/questions/true-false', icon: '❓' },
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
