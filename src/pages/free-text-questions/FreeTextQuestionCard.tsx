import { useState, useCallback, useEffect } from 'react'
import DOMPurify from 'dompurify'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { FreeTextQuestion } from '@/shared/data/types'
import './FreeTextQuestionCard.css'

interface FreeTextQuestionCardProps {
  readonly question: FreeTextQuestion
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

export default function FreeTextQuestionCard({ question, isExpandedView: defaultExpanded = false }: FreeTextQuestionCardProps) {
  const { language } = useAppSettings()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [showAnswer, setShowAnswer] = useState(false)

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
      setShowAnswer(false)
    }
  }, [isExpanded])

  const handleShowAnswer = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setShowAnswer(true)
  }, [])

  return (
    <div className={`ftq-card ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {!isExpanded && (
        <button 
          className="ftq-card-header"
          onClick={handleCardClick}
          type="button"
          aria-label={t('viewDetails', language)}
        >
          <div className="ftq-card-question-preview" dangerouslySetInnerHTML={renderHTML(stripHtmlAndTruncate(question.question, 150))} />
          <svg className="expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {isExpanded && (
        <div className="ftq-card-expanded">
          <div className="ftq-card-header-expanded">
            <div className="ftq-card-question-full" dangerouslySetInnerHTML={renderHTML(question.question)} />
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

          {question.difficultyLevel && (
            <div className="ftq-metadata">
              <div className="ftq-meta-item">
                <span className="meta-icon">📊</span>
                <span className="meta-value difficulty">{question.difficultyLevel}</span>
              </div>
            </div>
          )}

          {!showAnswer && (
            <div className="ftq-show-answer-btn-container">
              <button 
                className="ftq-show-answer-btn"
                onClick={handleShowAnswer}
                type="button"
              >
                {t('showAnswer', language)}
              </button>
            </div>
          )}

          {showAnswer && (
            <>
              <div className="ftq-answer">
                <h4>{t('answer', language)}</h4>
                <div className="answer-content" dangerouslySetInnerHTML={renderHTML(question.answer)} />
              </div>

              {question.explanation && (
                <div className="ftq-explanation">
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
