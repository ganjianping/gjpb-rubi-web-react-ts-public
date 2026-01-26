import { useState, useCallback, useEffect } from 'react'
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
  const [userAnswer, setUserAnswer] = useState('')
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  useEffect(() => {
    setIsExpanded(defaultExpanded)
  }, [defaultExpanded])

  const handleCardClick = useCallback(() => {
    if (!isExpanded) {
      setIsExpanded(true)
    }
  }, [isExpanded])

  const toggleExpanded = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)
    if (isExpanded) {
      setUserAnswer('')
      setIsAnswered(false)
      setIsCorrect(null)
    }
  }, [isExpanded])

  const handleCheckAnswer = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!userAnswer.trim()) return

    const correct = userAnswer.trim().toLowerCase() === question.answer.toLowerCase()
    setIsCorrect(correct)
    setIsAnswered(true)

    // Track success/fail
    if (correct) {
      await markFillBlankQuestionSuccessful(question.id)
    } else {
      await markFillBlankQuestionFailed(question.id)
    }
  }, [userAnswer, question.id, question.answer])

  const handleReset = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setUserAnswer('')
    setIsAnswered(false)
    setIsCorrect(null)
  }, [])

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
            <div className="fbq-card-question-full" dangerouslySetInnerHTML={renderHTML(question.question)} />
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

          <div className="fbq-answer-section">
            <input
              type="text"
              className="fbq-input"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={t('fillInTheBlank', language)}
              disabled={isAnswered}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isAnswered) {
                  handleCheckAnswer(e as unknown as React.MouseEvent)
                }
              }}
            />
            {!isAnswered && (
              <button 
                className="fbq-check-btn"
                onClick={handleCheckAnswer}
                disabled={!userAnswer.trim()}
                type="button"
              >
                {t('checkAnswer', language)}
              </button>
            )}
            {isAnswered && (
              <button 
                className="fbq-reset-btn"
                onClick={handleReset}
                type="button"
              >
                {t('tryAgain', language)}
              </button>
            )}
          </div>

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
                  <div className="answer-content" dangerouslySetInnerHTML={renderHTML(question.answer)} />
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
