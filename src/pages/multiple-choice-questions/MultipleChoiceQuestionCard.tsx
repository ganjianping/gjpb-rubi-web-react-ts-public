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
  const [errorOption, setErrorOption] = useState<string | null>(null)
  const errorTimeoutRef = useRef<number | null>(null)

  // Sync isExpanded with prop changes (for toggle view functionality)
  useEffect(() => {
    setIsExpanded(defaultExpanded)
  }, [defaultExpanded])

  const handleCardClick = useCallback(() => {
    if (!isExpanded) {
      setIsExpanded(true)
    }
  }, [isExpanded])

  const handleOptionClick = useCallback((e: React.MouseEvent, option: string) => {
    e.stopPropagation()
    if (!isCorrect && !selectedAnswers.includes(option)) {
      // Clear any existing error styling and remove previous wrong selections when selecting a new option
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
        errorTimeoutRef.current = null
      }
      setErrorOption(null)
      // Remove any previous wrong answers from selectedAnswers
      setSelectedAnswers(prev => prev.filter(ans => ans === question.answer))
      
      const newAnswers = [...selectedAnswers.filter(ans => ans === question.answer), option]
      setSelectedAnswers(newAnswers)
      if (option === question.answer) {
        setIsCorrect(true)
      } else {
        // Show error style for wrong answer
        setErrorOption(option)
        // Auto-remove error style and unselect the wrong option after 2 seconds
        errorTimeoutRef.current = window.setTimeout(() => {
          setErrorOption(null)
          setSelectedAnswers(prev => prev.filter(ans => ans !== option))
          errorTimeoutRef.current = null
        }, 2000)
      }
    }
  }, [isCorrect, selectedAnswers, question.answer])

  const getOptionClass = useCallback((option: string) => {
    const wasSelected = selectedAnswers.includes(option)
    if (!wasSelected) return 'mcq-option'
    if (option === errorOption) return 'mcq-option error'
    if (option === question.answer) return 'mcq-option correct'
    // This shouldn't happen with current logic, but fallback
    return 'mcq-option selected'
  }, [selectedAnswers, question.answer, errorOption])

  const toggleExpanded = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
    if (isExpanded) {
      // Reset answer state when collapsing
      setSelectedAnswers([])
      setIsCorrect(false)
      setErrorOption(null)
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
