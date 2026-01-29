import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import DOMPurify from 'dompurify'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import { markFillBlankQuestionSuccessful, markFillBlankQuestionFailed } from '@/shared/data/publicApi'
import type { FillBlankQuestion } from '@/shared/data/types'
import './FillBlankQuestionCard.css'

interface FillBlankQuestionCardProps {
  readonly question: FillBlankQuestion
  readonly isExpandedView?: boolean
}

const stripHtmlAndTruncate = (html: string, maxLength: number = 100): string => {
  const stripped = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] })
  if (stripped.length <= maxLength) return stripped
  return stripped.substring(0, maxLength).trim() + '...'
}

const renderHTML = (html: string) => {
  return { __html: DOMPurify.sanitize(html) }
}

export default function FillBlankQuestionCard({ question, isExpandedView: defaultExpanded = false }: FillBlankQuestionCardProps) {
  const { language } = useAppSettings()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Parse blanks count and correct answers
  const { blankCount, correctAnswers } = useMemo(() => {
    const sanitized = DOMPurify.sanitize(question.question, { ALLOWED_TAGS: [] })
    const count = (sanitized.match(/____/g) || []).length
    const answers = question.answer.split(',').map(a => a.trim())
    return { blankCount: count, correctAnswers: answers }
  }, [question.question, question.answer])

  useEffect(() => {
    setIsExpanded(defaultExpanded)
  }, [defaultExpanded])

  useEffect(() => {
    // Initialize user answers array when blank count changes
    setUserAnswers(new Array(blankCount).fill(''))
    inputRefs.current = new Array(blankCount).fill(null)
  }, [blankCount])

  // Auto-check when all inputs are filled
  useEffect(() => {
    if (isAnswered || blankCount === 0) return
    
    const allFilled = userAnswers.length === blankCount && userAnswers.every(ans => ans.trim() !== '')
    if (allFilled) {
      checkAnswers()
    }
  }, [userAnswers, blankCount, isAnswered])

  const checkAnswers = useCallback(async () => {
    const allCorrect = userAnswers.every((ans, idx) => 
      ans.trim().toLowerCase() === (correctAnswers[idx] || '').toLowerCase()
    )
    setIsCorrect(allCorrect)
    setIsAnswered(true)

    // Track success/fail
    if (allCorrect) {
      await markFillBlankQuestionSuccessful(question.id)
    } else {
      await markFillBlankQuestionFailed(question.id)
    }
  }, [userAnswers, correctAnswers, question.id])

  const handleCardClick = useCallback(() => {
    if (!isExpanded) {
      setIsExpanded(true)
    }
  }, [isExpanded])

  const toggleExpanded = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
    if (isExpanded) {
      setUserAnswers(new Array(blankCount).fill(''))
      setIsAnswered(false)
      setIsCorrect(null)
    }
  }, [isExpanded, blankCount])

  const handleInputChange = useCallback((index: number, value: string) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[index] = value
      return newAnswers
    })
  }, [])

  const handleReset = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setUserAnswers(new Array(blankCount).fill(''))
    setIsAnswered(false)
    setIsCorrect(null)
    // Focus first input after reset
    setTimeout(() => {
      inputRefs.current[0]?.focus()
    }, 0)
  }, [blankCount])

  // Render question with inline input fields
  const renderQuestionWithInputs = useCallback(() => {
    let sanitizedQuestion = DOMPurify.sanitize(question.question)
    let blankIndex = 0
    
    // Replace each ____ with a placeholder for input
    sanitizedQuestion = sanitizedQuestion.replace(/____/g, () => {
      const placeholder = `<!--BLANK_${blankIndex}-->`
      blankIndex++
      return placeholder
    })

    // Split by placeholders
    const parts = sanitizedQuestion.split(/<!--BLANK_(\d+)-->/)
    
    return (
      <div className="fbq-card-question-interactive">
        {parts.map((part, idx) => {
          // Odd indices are blank numbers
          if (idx % 2 === 1) {
            const blankIdx = parseInt(part)
            const isIncorrect = isAnswered && userAnswers[blankIdx]?.trim().toLowerCase() !== (correctAnswers[blankIdx] || '').toLowerCase()
            
            return (
              <input
                key={`blank-${blankIdx}`}
                ref={el => { inputRefs.current[blankIdx] = el }}
                type="text"
                className={`fbq-inline-input ${isAnswered ? (isIncorrect ? 'incorrect' : 'correct') : ''}`}
                value={userAnswers[blankIdx] || ''}
                onChange={(e) => handleInputChange(blankIdx, e.target.value)}
                disabled={isAnswered}
                placeholder="____"
                autoComplete="off"
              />
            )
          }
          // Even indices are HTML content
          return <span key={`text-${idx}`} dangerouslySetInnerHTML={{ __html: part }} />
        })}
      </div>
    )
  }, [question.question, userAnswers, isAnswered, correctAnswers, handleInputChange])

  return (
    <div className={`fbq-card ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {!isExpanded && (
        <button 
          className="fbq-card-header"
          onClick={handleCardClick}
          type="button"
          aria-label={t('viewDetails', language)}
        >
          <div className="fbq-card-question-preview" dangerouslySetInnerHTML={renderHTML(stripHtmlAndTruncate(question.question, 150))} />
          <svg className="expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {isExpanded && (
        <div className="fbq-card-expanded">
          <div className="fbq-card-header-expanded">
            {renderQuestionWithInputs()}
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

          <div className="fbq-metadata">
            {question.difficultyLevel && (
              <div className="fbq-meta-item">
                <span className="meta-icon">📊</span>
                <span className="meta-value difficulty">{question.difficultyLevel}</span>
              </div>
            )}
            <div className="fbq-meta-item">
              <span className="meta-icon">✅</span>
              <span className="meta-value success">{question.successCount}</span>
            </div>
            <div className="fbq-meta-item">
              <span className="meta-icon">❌</span>
              <span className="meta-value fail">{question.failCount}</span>
            </div>
          </div>

          {isAnswered && (
            <div className="fbq-actions">
              <button 
                className="fbq-reset-btn"
                onClick={handleReset}
                type="button"
              >
                {t('tryAgain', language)}
              </button>
            </div>
          )}

          {isAnswered && (
            <>
              <div className={`fbq-result ${isCorrect ? 'correct' : 'incorrect'}`}>
                {isCorrect ? (
                  <>
                    <span className="result-icon">✅</span>
                    <span>{t('correct', language)}!</span>
                  </>
                ) : (
                  <>
                    <span className="result-icon">❌</span>
                    <span>{t('incorrect', language)}</span>
                  </>
                )}
              </div>

              {!isCorrect && (
                <div className="fbq-answer">
                  <h4>{t('correctAnswer', language)}</h4>
                  <div className="answer-content">
                    {correctAnswers.map((ans, idx) => (
                      <div key={idx} className="answer-item">
                        <span className="answer-label">({idx + 1})</span> {ans}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {question.explanation && (
                <div className="fbq-explanation">
                  <h4>{t('explanation', language)}</h4>
                  <div className="explanation-content" dangerouslySetInnerHTML={renderHTML(question.explanation)} />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
