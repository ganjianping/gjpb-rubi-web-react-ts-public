import { useState, useEffect, useRef, memo, useCallback } from 'react'
import DOMPurify from 'dompurify'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { Sentence } from '@/shared/data/types'
import './SentenceDetail.css'

interface SentenceDetailProps {
  sentence: Sentence
  onClose: () => void
  onPrevious?: () => void
  onNext?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
}

export default function SentenceDetail({ sentence, onClose, onPrevious, onNext, hasPrevious = false, hasNext = false }: SentenceDetailProps) {
  const { language } = useAppSettings()
  
  // Toggle states for collapsible sections - consolidated into single state object
  const [toggleStates, setToggleStates] = useState({
    translation: true,
    explanation: true
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

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (sentence.phoneticAudioUrl) {
      // Clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      
      audioRef.current = new Audio(sentence.phoneticAudioUrl)
      audioRef.current.play().catch(err => {
        console.error('Audio playback failed:', err)
      })
    }
  }

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
    <div className="sentence-detail-overlay" onClick={handleBackdropClick}>
      <div className="sentence-detail-modal" ref={modalRef} tabIndex={-1}>
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
              <div className="detail-word" dangerouslySetInnerHTML={renderHTML(sentence.name)} />
              
              {/* Second Row: Phonetic and Audio */}
              {sentence.phonetic && (
                <div className="detail-phonetic-row">
                  <span className="detail-phonetic">
                    /<span dangerouslySetInnerHTML={renderHTML(sentence.phonetic)} />/
                  </span>
                  {sentence.phoneticAudioUrl && (
                    <button 
                      className="detail-audio-btn"
                      onClick={playAudio}
                      aria-label={t('playPronunciation', language)}
                    >
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
          {sentence.translation && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>{t('translation', language)}</h3>
                <ToggleButton isOpen={toggleStates.translation} onClick={() => toggleSection('translation')} />
              </div>
              {toggleStates.translation && (
                <div className="detail-html" dangerouslySetInnerHTML={renderHTML(sentence.translation)} />
              )}
            </div>
          )}

          {/* Explanation */}
          {sentence.explanation && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>{t('explanation', language)}</h3>
                <ToggleButton isOpen={toggleStates.explanation} onClick={() => toggleSection('explanation')} />
              </div>
              {toggleStates.explanation && (
                <div className="detail-html" dangerouslySetInnerHTML={renderHTML(sentence.explanation)} />
              )}
            </div>
          )}

          {/* Meta Information */}
          <div className="detail-meta-info">
            {sentence.tags && (
              <div className="detail-tags">
                {sentence.tags.split(',').map((tag, index) => (
                  <span key={index} className="detail-tag">{tag.trim()}</span>
                ))}
              </div>
            )}
            <span className="detail-difficulty" data-level={sentence.difficultyLevel?.toLowerCase()}>
              {sentence.difficultyLevel}
            </span>
            <span className="detail-meta-item">
              {t('term', language)} {sentence.term}
            </span>
            <span className="detail-meta-item">
              {t('week', language)} {sentence.week}
            </span>
            {sentence.displayOrder && (
              <span className="detail-meta-item">
                Order: {sentence.displayOrder}
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