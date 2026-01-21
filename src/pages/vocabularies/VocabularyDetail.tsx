import { useState, useEffect, useRef, memo, useCallback } from 'react'
import DOMPurify from 'dompurify'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { Vocabulary } from '@/shared/data/types'
import './VocabularyDetail.css'

interface VocabularyDetailProps {
  vocabulary: Vocabulary
  onClose: () => void
  onPrevious?: () => void
  onNext?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
}

export default function VocabularyDetail({ vocabulary, onClose, onPrevious, onNext, hasPrevious = false, hasNext = false }: VocabularyDetailProps) {
  const { language } = useAppSettings()
  
  // Toggle states for collapsible sections - consolidated into single state object
  const [toggleStates, setToggleStates] = useState({
    partOfSpeech: true,
    plural: true,
    verbTenses: true,
    comparative: true,
    synonyms: true,
    definition: true,
    example: true,
    nounDetails: true,
    verbDetails: true,
    adjectiveDetails: true,
    adverbDetails: true
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
    if (vocabulary.phoneticAudioUrl) {
      // Clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      
      audioRef.current = new Audio(vocabulary.phoneticAudioUrl)
      audioRef.current.play().catch(err => {
        console.error('Audio playback failed:', err)
      })
    }
  }, [vocabulary.phoneticAudioUrl])

  const partsOfSpeech = vocabulary.partOfSpeech.split(',').map(p => p.trim())

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
    <div className="vocabulary-detail-overlay" onClick={handleBackdropClick}>
      <div className="vocabulary-detail-modal" ref={modalRef} tabIndex={-1}>
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
          {/* Header with Image */}
          <div className="detail-header-wrapper">
            <div className="detail-header-text">
              {/* First Row: Name */}
              <h1 className="detail-word">{vocabulary.name}</h1>
              
              {/* Second Row: Phonetic and Audio */}
              {vocabulary.phonetic && (
                <div className="detail-phonetic-row">
                  <span className="detail-phonetic">/{vocabulary.phonetic}/</span>
                  {vocabulary.phoneticAudioUrl && (
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

            {/* Image */}
            {vocabulary.imageUrl && (
              <div className="detail-image-container">
                <img src={vocabulary.imageUrl} alt={vocabulary.name} />
              </div>
            )}
          </div>
          
          {/* Parts of Speech */}
          <div className="detail-section-toggle">
            <div className="section-header">
              <h3>{t('partsOfSpeech', language)}</h3>
              <ToggleButton isOpen={toggleStates.partOfSpeech} onClick={() => toggleSection('partOfSpeech')} />
            </div>
            {toggleStates.partOfSpeech && (
              <div className="detail-pos-badges">
                {partsOfSpeech.map((pos, index) => (
                  <span key={index} className="detail-pos-badge">{pos}</span>
                ))}
              </div>
            )}
          </div>
          
          {/* Plural Form */}
          {vocabulary.nounPluralForm && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>{t('plural', language)}</h3>
                <ToggleButton isOpen={toggleStates.plural} onClick={() => toggleSection('plural')} />
              </div>
              {toggleStates.plural && <p>{vocabulary.nounPluralForm}</p>}
            </div>
          )}
          
          {/* Verb Tenses */}
          {vocabulary.verbSimplePastTense && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>{t('verbTenses', language)}</h3>
                <ToggleButton isOpen={toggleStates.verbTenses} onClick={() => toggleSection('verbTenses')} />
              </div>
              {toggleStates.verbTenses && (
                <div>
                  {vocabulary.verbSimplePastTense && (
                    <p><strong>{t('simplePast', language)}:</strong> {vocabulary.verbSimplePastTense}</p>
                  )}
                  {vocabulary.verbPastPerfectTense && (
                    <p><strong>{t('pastPerfect', language)}:</strong> {vocabulary.verbPastPerfectTense}</p>
                  )}
                  {vocabulary.verbPresentParticiple && (
                    <p><strong>{t('presentParticiple', language)}:</strong> {vocabulary.verbPresentParticiple}</p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Comparative/Superlative Forms */}
          {vocabulary.adjectiveComparativeForm && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>{t('comparativeAndSuperlative', language)}</h3>
                <ToggleButton isOpen={toggleStates.comparative} onClick={() => toggleSection('comparative')} />
              </div>
              {toggleStates.comparative && (
                <div>
                  {vocabulary.adjectiveComparativeForm && (
                    <p><strong>{t('comparative', language)}:</strong> {vocabulary.adjectiveComparativeForm}</p>
                  )}
                  {vocabulary.adjectiveSuperlativeForm && (
                    <p><strong>{t('superlative', language)}:</strong> {vocabulary.adjectiveSuperlativeForm}</p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Synonyms */}
          {vocabulary.synonyms && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>{t('synonyms', language)}</h3>
                <ToggleButton isOpen={toggleStates.synonyms} onClick={() => toggleSection('synonyms')} />
              </div>
              {toggleStates.synonyms && <p>{vocabulary.synonyms}</p>}
            </div>
          )}

          {/* Definition */}
          {vocabulary.definition && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>{t('definition', language)}</h3>
                <ToggleButton isOpen={toggleStates.definition} onClick={() => toggleSection('definition')} />
              </div>
              {toggleStates.definition && (
                <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.definition)} />
              )}
            </div>
          )}

          {/* Example */}
          {vocabulary.example && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>{t('example', language)}</h3>
                <ToggleButton isOpen={toggleStates.example} onClick={() => toggleSection('example')} />
              </div>
              {toggleStates.example && (
                <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.example)} />
              )}
            </div>
          )}

          {/* Noun Details */}
          {vocabulary.nounForm && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>📝 {t('noun', language)}</h3>
                <ToggleButton isOpen={toggleStates.nounDetails} onClick={() => toggleSection('nounDetails')} />
              </div>
              {toggleStates.nounDetails && (
                <div>
                  {vocabulary.nounForm && <p><strong>{vocabulary.nounForm}:</strong> </p>}
                  {vocabulary.nounMeaning && (
                    <div>
                      <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.nounMeaning)} />
                    </div>
                  )}
                  {vocabulary.nounExample && (
                    <div>
                      <strong>{t('example', language)}:</strong>
                      <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.nounExample)} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Verb Details */}
          {vocabulary.verbForm && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>⚡ {t('verb', language)}</h3>
                <ToggleButton isOpen={toggleStates.verbDetails} onClick={() => toggleSection('verbDetails')} />
              </div>
              {toggleStates.verbDetails && (
                <div>
                  {vocabulary.verbForm && <p><strong>{vocabulary.verbForm}:</strong> </p>}
                  {vocabulary.verbMeaning && (
                    <div>
                      <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.verbMeaning)} />
                    </div>
                  )}
                  {vocabulary.verbExample && (
                    <div>
                      <strong>{t('example', language)}:</strong>
                      <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.verbExample)} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Adjective Details */}
          {vocabulary.adjectiveForm && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>🎨 {t('adjective', language)}</h3>
                <ToggleButton isOpen={toggleStates.adjectiveDetails} onClick={() => toggleSection('adjectiveDetails')} />
              </div>
              {toggleStates.adjectiveDetails && (
                <div>
                  {vocabulary.adjectiveForm && <p><strong>{vocabulary.adjectiveForm}:</strong> </p>}
                  {vocabulary.adjectiveMeaning && (
                    <div>
                      <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.adjectiveMeaning)} />
                    </div>
                  )}
                  {vocabulary.adjectiveExample && (
                    <div>
                      <strong>{t('example', language)}:</strong>
                      <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.adjectiveExample)} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Adverb Details */}
          {vocabulary.adverbForm && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>🌟 {t('adverb', language)}</h3>
                <ToggleButton isOpen={toggleStates.adverbDetails} onClick={() => toggleSection('adverbDetails')} />
              </div>
              {toggleStates.adverbDetails && (
                <div>
                  {vocabulary.adverbForm && <p><strong>{vocabulary.adverbForm}:</strong> </p>}
                  {vocabulary.adverbMeaning && (
                    <div>
                      <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.adverbMeaning)} />
                    </div>
                  )}
                  {vocabulary.adverbExample && (
                    <div>
                      <strong>{t('example', language)}:</strong>
                      <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.adverbExample)} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Meta Information */}
          <div className="detail-meta-info">
            {vocabulary.tags && (
              <div className="detail-tags">
                {vocabulary.tags.split(',').map((tag, index) => (
                  <span key={index} className="detail-tag">{tag.trim()}</span>
                ))}
              </div>
            )}
            <span className="detail-difficulty" data-level={vocabulary.difficultyLevel?.toLowerCase()}>
              {vocabulary.difficultyLevel}
            </span>
            <span className="detail-meta-item">
              {t('term', language)} {vocabulary.term}
            </span>
            <span className="detail-meta-item">
              {t('week', language)} {vocabulary.week}
            </span>
            {vocabulary.displayOrder && (
              <span className="detail-meta-item">
                Order: {vocabulary.displayOrder}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="detail-footer">
            <div className="detail-footer-content">
              {vocabulary.dictionaryUrl && (
                <a 
                  href={vocabulary.dictionaryUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="detail-dictionary-link"
                >
                  📖 {t('viewInDictionary', language)}
                </a>
              )}
            </div>
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
