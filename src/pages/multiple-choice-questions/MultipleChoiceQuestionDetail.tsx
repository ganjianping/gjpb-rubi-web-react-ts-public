import { useState, useEffect, useRef, memo, useCallback } from 'react'
import DOMPurify from 'dompurify'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { MultipleChoiceQuestion } from '@/shared/data/types'
import './MultipleChoiceQuestionDetail.css'

interface MultipleChoiceQuestionDetailProps {
  question: MultipleChoiceQuestion
  onClose: () => void
  onPrevious?: () => void
  onNext?: () => void
  hasPrevious?: boolean
  hasNext?: boolean
}

export default function MultipleChoiceQuestionDetail({ question, onClose, onPrevious, onNext, hasPrevious = false, hasNext = false }: MultipleChoiceQuestionDetailProps) {
  const { language } = useAppSettings()
  
  // Toggle states for collapsible sections
  const [toggleStates, setToggleStates] = useState({
    explanation: true
  })
  
  // User's selected answer
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)

  // Refs for focus management
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

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

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(null)
    setShowAnswer(false)
  }, [question.id])

  const renderHTML = useCallback((html: string) => {
    return { __html: DOMPurify.sanitize(html) }
  }, [])
  
  // Close on backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  const handleOptionClick = (option: string) => {
    setSelectedAnswer(option)
    setShowAnswer(true)
  }

  const getOptionClass = (option: string) => {
    if (!showAnswer) return 'mcq-option'
    if (option === question.answer) return 'mcq-option correct'
    if (option === selectedAnswer && option !== question.answer) return 'mcq-option incorrect'
    return 'mcq-option'
  }

  return (
    <div className="mcq-detail-overlay" onClick={handleBackdropClick}>
      <div className="mcq-detail-modal" ref={modalRef} tabIndex={-1}>
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
          {/* Question */}
          <div className="mcq-detail-question">
            <div className="detail-question-text" dangerouslySetInnerHTML={renderHTML(question.question)} />
          </div>
          
          {/* Options */}
          <div className="mcq-detail-options">
            <button 
              className={getOptionClass('A')}
              onClick={() => handleOptionClick('A')}
              type="button"
              disabled={showAnswer}
            >
              <span className="option-letter">A</span>
              <span className="option-content" dangerouslySetInnerHTML={renderHTML(question.optionA)} />
              {showAnswer && question.answer === 'A' && <span className="option-indicator">✓</span>}
              {showAnswer && selectedAnswer === 'A' && question.answer !== 'A' && <span className="option-indicator">✗</span>}
            </button>
            
            <button 
              className={getOptionClass('B')}
              onClick={() => handleOptionClick('B')}
              type="button"
              disabled={showAnswer}
            >
              <span className="option-letter">B</span>
              <span className="option-content" dangerouslySetInnerHTML={renderHTML(question.optionB)} />
              {showAnswer && question.answer === 'B' && <span className="option-indicator">✓</span>}
              {showAnswer && selectedAnswer === 'B' && question.answer !== 'B' && <span className="option-indicator">✗</span>}
            </button>
            
            <button 
              className={getOptionClass('C')}
              onClick={() => handleOptionClick('C')}
              type="button"
              disabled={showAnswer}
            >
              <span className="option-letter">C</span>
              <span className="option-content" dangerouslySetInnerHTML={renderHTML(question.optionC)} />
              {showAnswer && question.answer === 'C' && <span className="option-indicator">✓</span>}
              {showAnswer && selectedAnswer === 'C' && question.answer !== 'C' && <span className="option-indicator">✗</span>}
            </button>
            
            <button 
              className={getOptionClass('D')}
              onClick={() => handleOptionClick('D')}
              type="button"
              disabled={showAnswer}
            >
              <span className="option-letter">D</span>
              <span className="option-content" dangerouslySetInnerHTML={renderHTML(question.optionD)} />
              {showAnswer && question.answer === 'D' && <span className="option-indicator">✓</span>}
              {showAnswer && selectedAnswer === 'D' && question.answer !== 'D' && <span className="option-indicator">✗</span>}
            </button>
          </div>

          {/* Answer Feedback */}
          {showAnswer && (
            <div className={`mcq-feedback ${selectedAnswer === question.answer ? 'correct' : 'incorrect'}`}>
              {selectedAnswer === question.answer ? (
                <>
                  <span className="feedback-icon">✓</span>
                  <span className="feedback-text">{t('correctAnswer', language) || 'Correct!'}</span>
                </>
              ) : (
                <>
                  <span className="feedback-icon">✗</span>
                  <span className="feedback-text">{t('incorrectAnswer', language) || `Incorrect. The correct answer is ${question.answer}.`}</span>
                </>
              )}
            </div>
          )}

          {/* Explanation */}
          {showAnswer && question.explanation && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>{t('explanation', language)}</h3>
                <ToggleButton isOpen={toggleStates.explanation} onClick={() => toggleSection('explanation')} />
              </div>
              {toggleStates.explanation && (
                <div className="detail-html" dangerouslySetInnerHTML={renderHTML(question.explanation)} />
              )}
            </div>
          )}

          {/* Meta Information */}
          <div className="detail-meta-info">
            {question.tags && (
              <div className="detail-tags">
                {question.tags.split(',').map((tag, index) => (
                  <span key={index} className="detail-tag">{tag.trim()}</span>
                ))}
              </div>
            )}
            <span className="detail-difficulty" data-level={question.difficultyLevel?.toLowerCase()}>
              {question.difficultyLevel}
            </span>
            <span className="detail-meta-item">
              {t('term', language)} {question.term}
            </span>
            <span className="detail-meta-item">
              {t('week', language)} {question.week}
            </span>
            {question.displayOrder && (
              <span className="detail-meta-item">
                Order: {question.displayOrder}
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
