import { useState, useCallback, useEffect, useRef } from 'react'
import DOMPurify from 'dompurify'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { MultipleChoiceQuestion } from '@/shared/data/types'
import './MultipleChoiceQuestionCard.css'

interface MultipleChoiceQuestionCardProps {
  readonly question: MultipleChoiceQuestion
  readonly isExpandedView?: boolean
}

// Utility function to strip HTML and truncate text
const stripHtmlAndTruncate = (html: string, maxLength: number = 100): string => {
  const stripped = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] })
  if (stripped.length <= maxLength) return stripped
  return stripped.substring(0, maxLength).trim() + '...'
}

// Utility function to render HTML safely
const renderHTML = (html: string) => {
  return { __html: DOMPurify.sanitize(html) }
}

export default function MultipleChoiceQuestionCard({ question, isExpandedView: defaultExpanded = false }: MultipleChoiceQuestionCardProps) {
  const { language } = useAppSettings()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const errorTimeoutRef = useRef<number | null>(null)

  const handleCardClick = useCallback(() => {
    if (!isExpanded) {
      setIsExpanded(true)
    }
  }, [isExpanded])

  const handleOptionClick = useCallback((e: React.MouseEvent, option: string) => {
    e.stopPropagation()
    if (!isCorrect && !selectedAnswers.includes(option)) {
      // Clear any existing error message when selecting a new option
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
        errorTimeoutRef.current = null
      }
      setErrorMessage(null)
      
      const newAnswers = [...selectedAnswers, option]
      setSelectedAnswers(newAnswers)
      if (option === question.answer) {
        setIsCorrect(true)
      } else {
        // Show error message for wrong answer
        setErrorMessage(t('incorrectAnswer', language))
        // Auto-dismiss after 2 seconds
        errorTimeoutRef.current = window.setTimeout(() => {
          setErrorMessage(null)
          errorTimeoutRef.current = null
        }, 2000)
      }
    }
  }, [isCorrect, selectedAnswers, question.answer, language])

  const getOptionClass = useCallback((option: string) => {
    const wasSelected = selectedAnswers.includes(option)
    if (!wasSelected) return 'mcq-option'
    if (option === question.answer) return 'mcq-option correct'
    return 'mcq-option incorrect'
  }, [selectedAnswers, question.answer])

  const toggleExpanded = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
    if (isExpanded) {
      // Reset answer state when collapsing
      setSelectedAnswers([])
      setIsCorrect(false)
      setErrorMessage(null)
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
        errorTimeoutRef.current = null
      }
    }
  }, [isExpanded])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className={`mcq-card ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Collapsed view - just the question (1 line) */}
      {!isExpanded && (
        <button 
          className="mcq-card-header"
          onClick={handleCardClick}
          type="button"
          aria-label={t('viewDetails', language)}
        >
          <div className="mcq-card-question-preview" dangerouslySetInnerHTML={renderHTML(stripHtmlAndTruncate(question.question, 150))} />
          <svg className="expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Expanded view - full question and options */}
      {isExpanded && (
        <div className="mcq-card-expanded">
          {/* Question header with collapse button */}
          <div className="mcq-card-header-expanded">
            <div className="mcq-card-question-full" dangerouslySetInnerHTML={renderHTML(question.question)} />
            <button 
              className="collapse-btn"
              onClick={toggleExpanded}
              type="button"
              aria-label={t('hide', language)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 15l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          {/* Options */}
          <div className="mcq-options">
            <button 
              className={getOptionClass('A')}
              onClick={(e) => handleOptionClick(e, 'A')}
              type="button"
              disabled={isCorrect || selectedAnswers.includes('A')}
            >
              <span className="option-letter">A</span>
              <span className="option-content" dangerouslySetInnerHTML={renderHTML(question.optionA)} />
              {selectedAnswers.includes('A') && question.answer === 'A' && <span className="option-indicator correct-indicator">✓</span>}
              {selectedAnswers.includes('A') && question.answer !== 'A' && <span className="option-indicator incorrect-indicator">✗</span>}
            </button>
            
            <button 
              className={getOptionClass('B')}
              onClick={(e) => handleOptionClick(e, 'B')}
              type="button"
              disabled={isCorrect || selectedAnswers.includes('B')}
            >
              <span className="option-letter">B</span>
              <span className="option-content" dangerouslySetInnerHTML={renderHTML(question.optionB)} />
              {selectedAnswers.includes('B') && question.answer === 'B' && <span className="option-indicator correct-indicator">✓</span>}
              {selectedAnswers.includes('B') && question.answer !== 'B' && <span className="option-indicator incorrect-indicator">✗</span>}
            </button>
            
            <button 
              className={getOptionClass('C')}
              onClick={(e) => handleOptionClick(e, 'C')}
              type="button"
              disabled={isCorrect || selectedAnswers.includes('C')}
            >
              <span className="option-letter">C</span>
              <span className="option-content" dangerouslySetInnerHTML={renderHTML(question.optionC)} />
              {selectedAnswers.includes('C') && question.answer === 'C' && <span className="option-indicator correct-indicator">✓</span>}
              {selectedAnswers.includes('C') && question.answer !== 'C' && <span className="option-indicator incorrect-indicator">✗</span>}
            </button>
            
            <button 
              className={getOptionClass('D')}
              onClick={(e) => handleOptionClick(e, 'D')}
              type="button"
              disabled={isCorrect || selectedAnswers.includes('D')}
            >
              <span className="option-letter">D</span>
              <span className="option-content" dangerouslySetInnerHTML={renderHTML(question.optionD)} />
              {selectedAnswers.includes('D') && question.answer === 'D' && <span className="option-indicator correct-indicator">✓</span>}
              {selectedAnswers.includes('D') && question.answer !== 'D' && <span className="option-indicator incorrect-indicator">✗</span>}
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mcq-error-message">
              <span className="error-icon">✗</span>
              <span className="error-text">{errorMessage}</span>
            </div>
          )}

          {/* Answer Feedback */}
          {isCorrect && (
            <div className="mcq-feedback correct">
              <span className="feedback-icon">✓</span>
              <span className="feedback-text">{t('correctAnswer', language)}</span>
            </div>
          )}

          {/* Explanation */}
          {isCorrect && question.explanation && (
            <div className="mcq-explanation">
              <h4>{t('explanation', language)}</h4>
              <div className="explanation-content" dangerouslySetInnerHTML={renderHTML(question.explanation)} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
