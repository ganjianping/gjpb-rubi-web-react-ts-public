import { useState, useCallback, useEffect } from 'react'
import DOMPurify from 'dompurify'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import { markTrueFalseQuestionSuccessful, markTrueFalseQuestionFailed } from '@/shared/data/publicApi'
import type { TrueFalseQuestion } from '@/shared/data/types'
import './TrueFalseQuestionCard.css'

interface TrueFalseQuestionCardProps {
  readonly question: TrueFalseQuestion
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

export default function TrueFalseQuestionCard({ question, isExpandedView: defaultExpanded = false }: TrueFalseQuestionCardProps) {
  const { language } = useAppSettings()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
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
      setIsAnswered(false)
      setIsCorrect(null)
    }
  }, [isExpanded])

  const handleAnswer = useCallback(async (answer: 'TRUE' | 'FALSE') => {
    if (isAnswered) return

    const correct = answer === question.answer
    setIsCorrect(correct)
    setIsAnswered(true)

    // Track success/fail
    if (correct) {
      await markTrueFalseQuestionSuccessful(question.id)
    } else {
      await markTrueFalseQuestionFailed(question.id)
    }
  }, [isAnswered, question.id, question.answer])

  const handleReset = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAnswered(false)
    setIsCorrect(null)
    setIsCorrect(null)
  }, [])

  return (
    <div className={`tfq-card ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {!isExpanded && (
        <button 
          className="tfq-card-header"
          onClick={handleCardClick}
          type="button"
          aria-label={t('viewDetails', language)}
        >
          <div className="tfq-card-question-preview" dangerouslySetInnerHTML={renderHTML(stripHtmlAndTruncate(question.question, 150))} />
          <svg className="expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {isExpanded && (
        <div className="tfq-card-expanded">
          <div className="tfq-card-header-expanded">
            <div className="tfq-card-question-full" dangerouslySetInnerHTML={renderHTML(question.question)} />
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

          <div className="tfq-metadata">
            {question.difficultyLevel && (
              <div className="tfq-meta-item">
                <span className="meta-icon">📊</span>
                <span className="meta-value difficulty">{question.difficultyLevel}</span>
              </div>
            )}
            <div className="tfq-meta-item">
              <span className="meta-icon">✅</span>
              <span className="meta-value success">{question.successCount}</span>
            </div>
            <div className="tfq-meta-item">
              <span className="meta-icon">❌</span>
              <span className="meta-value fail">{question.failCount}</span>
            </div>
          </div>

          {!isAnswered && (
            <div className="tfq-answer-buttons">
              <button 
                className="tfq-btn tfq-btn-true"
                onClick={() => handleAnswer('TRUE')}
                type="button"
              >
                ✓ {t('trueFalse', language).split('/')[0] || 'TRUE'}
              </button>
              <button 
                className="tfq-btn tfq-btn-false"
                onClick={() => handleAnswer('FALSE')}
                type="button"
              >
                ✗ {t('trueFalse', language).split('/')[1] || 'FALSE'}
              </button>
            </div>
          )}

          {isAnswered && (
            <>
              <div className={`tfq-result ${isCorrect ? 'correct' : 'incorrect'}`}>
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
                <div className="tfq-answer">
                  <h4>{t('correctAnswer', language)}</h4>
                  <div className="answer-content">
                    {question.answer === 'TRUE' ? (t('trueFalse', language).split('/')[0] || 'TRUE') : (t('trueFalse', language).split('/')[1] || 'FALSE')}
                  </div>
                </div>
              )}

              {question.explanation && (
                <div className="tfq-explanation">
                  <h4>{t('explanation', language)}</h4>
                  <div className="explanation-content" dangerouslySetInnerHTML={renderHTML(question.explanation)} />
                </div>
              )}

              <button 
                className="tfq-reset-btn"
                onClick={handleReset}
                type="button"
              >
                {t('tryAgain', language)}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
