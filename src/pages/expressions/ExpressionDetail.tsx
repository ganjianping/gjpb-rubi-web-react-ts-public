import { useState, useEffect, useRef, memo, useCallback } from 'react'
import DOMPurify from 'dompurify'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { Expression } from '@/shared/data/types'
import './ExpressionDetail.css'

interface ExpressionDetailProps {
  expression: Expression
  onClose: () => void
  onPrevious?: () => void
  onNext?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
}

export default function ExpressionDetail({ expression, onClose, onPrevious, onNext, hasPrevious = false, hasNext = false }: ExpressionDetailProps) {
  const { language } = useAppSettings()
  
  // Toggle states for collapsible sections - consolidated into single state object
  const [toggleStates, setToggleStates] = useState({
    translation: true,
    explanation: true,
    example: true
  })

  // Refs for focus management and audio cleanup
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Check if all sections are currently expanded
  const allExpanded = Object.values(toggleStates).every(v => v)

  const handleToggleAll = useCallback(() => {
    const newState = !allExpanded
    setToggleStates(prev => 
      Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: newState }), {} as typeof toggleStates)
    )
  }, [allExpanded])

  const toggleSection = useCallback((section: keyof typeof toggleStates) => {
    setToggleStates(prev => ({ ...prev, [section]: !prev[section] }))
  }, [])

  const playAudio = useCallback(() => {
    if (expression.phoneticAudioUrl) {
      // Clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      
      audioRef.current = new Audio(expression.phoneticAudioUrl)
      audioRef.current.play().catch(err => {
        console.error('Audio playback failed:', err)
      })
    }
  }, [expression.phoneticAudioUrl])

  // Focus management for accessibility
  useEffect(() => {
    previousActiveElement.current = document.activeElement as HTMLElement
    modalRef.current?.focus()
    
    return () => {
      previousActiveElement.current?.focus()
    }
  }, [])

  // Keyboard navigation with Escape key support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'ArrowLeft' && hasPrevious && onPrevious) {
        event.preventDefault()
        onPrevious()
      } else if (event.key === 'ArrowRight' && hasNext && onNext) {
        event.preventDefault()
        onNext()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [hasPrevious, hasNext, onPrevious, onNext, onClose])

  // Audio cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const renderHTML = useCallback((html: string) => {
    return { __html: DOMPurify.sanitize(html) }
  }, [])
  
  // Close on backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  return (
    <div className="expression-detail-overlay" onClick={handleBackdropClick}>
      <div className="expression-detail-modal" ref={modalRef} tabIndex={-1}>
        <div className="detail-actions">
          <button className="detail-action-btn detail-close-btn" onClick={onClose} aria-label="Close">✕</button>
          <button 
            className="detail-action-btn" 
            onClick={handleToggleAll} 
            title={allExpanded ? t('collapseAll', language) : t('expandAll', language)}
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {allExpanded ? (
                <path d="M8 5L12 9L16 5M8 19L12 15L16 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <path d="M8 9L12 5L16 9M8 15L12 19L16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              )}
            </svg>
          </button>
        </div>
        
        <div className="detail-content">
          {/* Header */}
          <div className="detail-header-wrapper">
            <div className="detail-header-text">
              {/* First Row: Name */}
              <h1 className="detail-word">{expression.name}</h1>
              
              {/* Second Row: Phonetic and Audio */}
              {expression.phonetic && (
                <div className="detail-phonetic-row">
                  <span className="detail-phonetic">/{expression.phonetic}/</span>
                  {expression.phoneticAudioUrl && (
                    <button className="detail-audio-btn" onClick={playAudio} title={t('playPronunciation', language)}>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/>
                        <path d="M15.54 8.46a5 5 0 010 7.07M18.07 5.93a9 9 0 010 12.73" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Translation */}
          {expression.translation && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>{t('translation', language)}</h3>
                <ToggleButton isOpen={toggleStates.translation} onClick={() => toggleSection('translation')} />
              </div>
              {toggleStates.translation && <p>{expression.translation}</p>}
            </div>
          )}

          {/* Explanation */}
          {expression.explanation && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>{t('explanation', language)}</h3>
                <ToggleButton isOpen={toggleStates.explanation} onClick={() => toggleSection('explanation')} />
              </div>
              {toggleStates.explanation && (
                <div className="detail-html" dangerouslySetInnerHTML={renderHTML(expression.explanation)} />
              )}
            </div>
          )}

          {/* Example */}
          {expression.example && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>{t('example', language)}</h3>
                <ToggleButton isOpen={toggleStates.example} onClick={() => toggleSection('example')} />
              </div>
              {toggleStates.example && (
                <div className="detail-html" dangerouslySetInnerHTML={renderHTML(expression.example)} />
              )}
            </div>
          )}

          {/* Meta Information */}
          <div className="detail-meta-info">
            {expression.tags && (
              <div className="detail-tags">
                {expression.tags.split(',').map((tag, index) => (
                  <span key={index} className="detail-tag">{tag.trim()}</span>
                ))}
              </div>
            )}
            <span className="detail-difficulty" data-level={expression.difficultyLevel?.toLowerCase()}>
              {expression.difficultyLevel}
            </span>
            <span className="detail-meta-item">
              {t('term', language)} {expression.term}
            </span>
            <span className="detail-meta-item">
              {t('week', language)} {expression.week}
            </span>
            {expression.displayOrder && (
              <span className="detail-meta-item">
                Order: {expression.displayOrder}
              </span>
            )}
          </div>
        </div>
        
        {/* Navigation Buttons - Fixed at bottom */}
        {(hasPrevious || hasNext) && (
          <div className="detail-navigation">
            <button 
              className="detail-nav-btn detail-nav-icon-btn"
              onClick={onPrevious}
              disabled={!hasPrevious}
              title={t('previous', language)}
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className="detail-nav-btn detail-nav-icon-btn"
              onClick={onNext}
              disabled={!hasNext}
              title={t('next', language)}
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Memoized ToggleButton component for performance optimization
const ToggleButton = memo(({ isOpen, onClick }: { isOpen: boolean, onClick: () => void }) => {
  const { language } = useAppSettings()
  
  return (
    <button 
      className="toggle-btn" 
      onClick={onClick} 
      type="button" 
      aria-label={isOpen ? t('hide', language) : t('show', language)}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {isOpen ? (
          <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        ) : (
          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        )}
      </svg>
    </button>
  )
})

ToggleButton.displayName = 'ToggleButton'
