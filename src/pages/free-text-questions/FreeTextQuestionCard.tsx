import { useState, useCallback, useEffect } from 'react'
import DOMPurify from 'dompurify'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { FreeTextQuestion } from '@/shared/data/types'
import './FreeTextQuestionCard.css'

// Define Language type since it matches the one used in i18n/context but might not be exported
type Language = 'EN' | 'ZH';

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

const QuestionPart = ({ 
  label, 
  questionHtml, 
  answerHtml, 
  isVisible, 
  onToggle,
  language
}: { 
  label: string, 
  questionHtml: string, 
  answerHtml: string | undefined | null,
  isVisible: boolean, 
  onToggle: (e: React.MouseEvent) => void,
  language: Language
}) => {
  return (
    <div className="ftq-exam-part">
      <div className="ftq-exam-part-label">{label}</div>
      <div className="ftq-exam-part-content">
        <div className="ftq-exam-question-line">
          <div className="ftq-exam-text" dangerouslySetInnerHTML={renderHTML(questionHtml)} />
          {!isVisible && (
            <button className="ftq-exam-show-btn" onClick={onToggle} type="button">
              {t('showAnswer', language)}
            </button>
          )}
        </div>
        {isVisible && answerHtml && (
          <div className="ftq-exam-answer-box">
             <span className="ftq-exam-answer-label">{t('answer', language)}:</span>
             <div className="ftq-exam-answer-text" dangerouslySetInnerHTML={renderHTML(answerHtml)} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function FreeTextQuestionCard({ question, isExpandedView: defaultExpanded = false }: FreeTextQuestionCardProps) {
  const { language } = useAppSettings()
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showAnswerA, setShowAnswerA] = useState(false)
  const [showAnswerB, setShowAnswerB] = useState(false)
  const [showAnswerC, setShowAnswerC] = useState(false)
  const [showAnswerD, setShowAnswerD] = useState(false)
  const [showAnswerE, setShowAnswerE] = useState(false)
  const [showAnswerF, setShowAnswerF] = useState(false)

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
      setShowAnswerA(false)
      setShowAnswerB(false)
      setShowAnswerC(false)
      setShowAnswerD(false)
      setShowAnswerE(false)
      setShowAnswerF(false)
    }
  }, [isExpanded])

  const handleShowAnswer = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setShowAnswer(true)
  }, [])

  const previewContent = question.question || question.description || question.questiona || ''

  return (
    <div className={`ftq-card ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {!isExpanded && (
        <button 
          className="ftq-card-header"
          onClick={handleCardClick}
          type="button"
          aria-label={t('viewDetails', language)}
        >
          <div className="ftq-card-question-preview" dangerouslySetInnerHTML={renderHTML(stripHtmlAndTruncate(previewContent, 150))} />
          <svg className="expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {isExpanded && (
        <div className="ftq-card-expanded">
          <div className="ftq-card-header-expanded">
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

          {/* Show description if main question is empty */}
          {!question.question && question.description && (
            <div className="ftq-exam-description" dangerouslySetInnerHTML={renderHTML(question.description)} />
          )}

          {/* Main question and answer (if present) */}
          {question.question && (
            <div className="ftq-exam-main-question">
              <div className="ftq-exam-question-line">
                <div className="ftq-exam-text" dangerouslySetInnerHTML={renderHTML(question.question)} />
                {!showAnswer && (
                  <button 
                    className="ftq-exam-show-btn"
                    onClick={handleShowAnswer}
                    type="button"
                  >
                    {t('showAnswer', language)}
                  </button>
                )}
              </div>
              {showAnswer && question.answer && (
                <div className="ftq-exam-answer-box">
                  <span className="ftq-exam-answer-label">{t('answer', language)}:</span>
                  <div className="ftq-exam-answer-text" dangerouslySetInnerHTML={renderHTML(question.answer)} />
                </div>
              )}
            </div>
          )}

          {/* Parts A-F */}
          <div className="ftq-exam-parts-container">
            {question.questiona && (
              <QuestionPart 
                label="a)" 
                questionHtml={question.questiona} 
                answerHtml={question.answera} 
                isVisible={showAnswerA} 
                onToggle={(e) => { e.stopPropagation(); setShowAnswerA(true); }} 
                language={language}
              />
            )}

            {question.questionb && (
              <QuestionPart 
                label="b)" 
                questionHtml={question.questionb} 
                answerHtml={question.answerb} 
                isVisible={showAnswerB} 
                onToggle={(e) => { e.stopPropagation(); setShowAnswerB(true); }} 
                language={language}
              />
            )}

            {question.questionc && (
              <QuestionPart 
                label="c)" 
                questionHtml={question.questionc} 
                answerHtml={question.answerc} 
                isVisible={showAnswerC} 
                onToggle={(e) => { e.stopPropagation(); setShowAnswerC(true); }} 
                language={language}
              />
            )}

            {question.questiond && (
              <QuestionPart 
                label="d)" 
                questionHtml={question.questiond} 
                answerHtml={question.answerd} 
                isVisible={showAnswerD} 
                onToggle={(e) => { e.stopPropagation(); setShowAnswerD(true); }} 
                language={language}
              />
            )}

            {question.questione && (
              <QuestionPart 
                label="e)" 
                questionHtml={question.questione} 
                answerHtml={question.answere} 
                isVisible={showAnswerE} 
                onToggle={(e) => { e.stopPropagation(); setShowAnswerE(true); }} 
                language={language}
              />
            )}

            {question.questionf && (
              <QuestionPart 
                label="f)" 
                questionHtml={question.questionf} 
                answerHtml={question.answerf} 
                isVisible={showAnswerF} 
                onToggle={(e) => { e.stopPropagation(); setShowAnswerF(true); }} 
                language={language}
              />
            )}
          </div>


          {/* Explanation */}
          {question.explanation && (
            <div className="ftq-explanation">
              <h4>{t('explanation', language)}</h4>
              <div className="explanation-content" dangerouslySetInnerHTML={renderHTML(question.explanation)} />
            </div>
          )}

          {question.difficultyLevel && (
            <div className="ftq-metadata">
              <div className="ftq-meta-item">
                <span className="meta-icon">📊</span>
                <span className="meta-value difficulty">{question.difficultyLevel}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
