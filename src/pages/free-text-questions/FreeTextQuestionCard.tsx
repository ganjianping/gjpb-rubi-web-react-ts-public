import { useState, useCallback, useEffect } from 'react'
import DOMPurify from 'dompurify'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { FreeTextQuestion } from '@/shared/data/types'
import { updateFreeTextQuestionSuccess, updateFreeTextQuestionFail } from '@/shared/data/publicApi'
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

const EyeIcon = () => (
  // <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //   <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
  //   <circle cx="12" cy="12" r="3"></circle>
  // </svg>
  // using generic "eye" path 
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4.5C7.5 4.5 3.5 7.5 2 12C3.5 16.5 7.5 19.5 12 19.5C16.5 19.5 20.5 16.5 22 12C20.5 7.5 16.5 4.5 12 4.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19.5C7.5 19.5 3.5 16.5 2 12C3.12 8.62 5.86 6.16 9.24 5.06M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 15L9 9M12 4.5C16.5 4.5 20.5 7.5 22 12C21.2 14.39 19.46 16.32 17.29 17.29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CheckIcon = () => (
   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
     <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
   </svg>
)

const XIcon = () => (
   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
     <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
     <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
   </svg>
)

const QuestionPart = ({ 
  label, 
  questionHtml, 
  answerHtml, 
  isVisible, 
  onToggle,
  language,
  questionId
}: { 
  label: string, 
  questionHtml: string, 
  answerHtml: string | undefined | null,
  isVisible: boolean, 
  onToggle: (e: React.MouseEvent) => void,
  language: Language,
  questionId: string
}) => {
  const [userAnswer, setUserAnswer] = useState('')
  const [feedbackStatus, setFeedbackStatus] = useState<'none' | 'success' | 'fail'>('none')

  const handleSuccess = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const success = await updateFreeTextQuestionSuccess(questionId)
    if (success) setFeedbackStatus('success')
  }

  const handleFail = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const success = await updateFreeTextQuestionFail(questionId)
    if (success) setFeedbackStatus('fail')
  }

  return (
    <div className="ftq-exam-part">
      <div className="ftq-exam-part-label">{label}</div>
      <div className="ftq-exam-part-content">
        <div className="ftq-exam-question-line">
          <div className="ftq-exam-text" dangerouslySetInnerHTML={renderHTML(questionHtml)} />
        </div>
        <div className="ftq-exam-interaction-row">
          <textarea 
            className="ftq-user-input" 
            placeholder={t('yourAnswer', language)} 
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
          <div className="ftq-action-buttons">
            <button 
              className={`ftq-icon-btn ${isVisible ? 'active' : ''}`}
              onClick={onToggle} 
              type="button" 
              title={isVisible ? t('hide', language) : t('showAnswer', language)}
              aria-label={isVisible ? t('hide', language) : t('showAnswer', language)}
            >
              {isVisible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
            {isVisible && (
              <>
                <button 
                  className={`ftq-icon-btn ftq-success-btn ${feedbackStatus === 'success' ? 'selected' : ''}`}
                  onClick={handleSuccess}
                  type="button"
                  title={t('correct', language)} // Assuming 'correct' key exists or will fallback
                  disabled={feedbackStatus !== 'none'}
                >
                  <CheckIcon />
                </button>
                <button 
                  className={`ftq-icon-btn ftq-fail-btn ${feedbackStatus === 'fail' ? 'selected' : ''}`}
                  onClick={handleFail}
                  type="button"
                  title={t('incorrect', language)} // Assuming 'incorrect' key exists or will fallback
                  disabled={feedbackStatus !== 'none'}
                >
                  <XIcon />
                </button>
              </>
            )}
          </div>
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
  const [mainAnswer, setMainAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [showAnswerA, setShowAnswerA] = useState(false)
  const [showAnswerB, setShowAnswerB] = useState(false)
  const [showAnswerC, setShowAnswerC] = useState(false)
  const [showAnswerD, setShowAnswerD] = useState(false)
  const [showAnswerE, setShowAnswerE] = useState(false)
  const [showAnswerF, setShowAnswerF] = useState(false)
  const [mainFeedback, setMainFeedback] = useState<'none' | 'success' | 'fail'>('none')

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

  const toggleShowAnswer = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setShowAnswer(!showAnswer)
  }, [showAnswer])

  const handleMainSuccess = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const success = await updateFreeTextQuestionSuccess(question.id)
    if (success) setMainFeedback('success')
  }

  const handleMainFail = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const success = await updateFreeTextQuestionFail(question.id)
    if (success) setMainFeedback('fail')
  }

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
              </div>
              <div className="ftq-exam-interaction-row">
                <textarea 
                  className="ftq-user-input" 
                  placeholder={t('yourAnswer', language)} 
                  value={mainAnswer}
                  onChange={(e) => setMainAnswer(e.target.value)}
                />
                <div className="ftq-action-buttons">
                  <button 
                    className={`ftq-icon-btn ${showAnswer ? 'active' : ''}`}
                    onClick={toggleShowAnswer}
                    type="button"
                    title={showAnswer ? t('hide', language) : t('showAnswer', language)}
                    aria-label={showAnswer ? t('hide', language) : t('showAnswer', language)}
                  >
                    {showAnswer ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                  {showAnswer && (
                    <>
                      <button 
                        className={`ftq-icon-btn ftq-success-btn ${mainFeedback === 'success' ? 'selected' : ''}`}
                        onClick={handleMainSuccess}
                        type="button"
                        title={t('correct', language)} // Add these keys to i18n if missing, fallback is ok
                        disabled={mainFeedback !== 'none'}
                      >
                        <CheckIcon />
                      </button>
                      <button 
                        className={`ftq-icon-btn ftq-fail-btn ${mainFeedback === 'fail' ? 'selected' : ''}`}
                        onClick={handleMainFail}
                        type="button"
                        title={t('incorrect', language)}
                        disabled={mainFeedback !== 'none'}
                      >
                        <XIcon />
                      </button>
                    </>
                  )}
                </div>
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
                onToggle={(e) => { e.stopPropagation(); setShowAnswerA(!showAnswerA); }} 
                language={language}
                questionId={question.id}
              />
            )}

            {question.questionb && (
              <QuestionPart 
                label="b)" 
                questionHtml={question.questionb} 
                answerHtml={question.answerb} 
                isVisible={showAnswerB} 
                onToggle={(e) => { e.stopPropagation(); setShowAnswerB(!showAnswerB); }} 
                language={language}
                questionId={question.id}
              />
            )}

            {question.questionc && (
              <QuestionPart 
                label="c)" 
                questionHtml={question.questionc} 
                answerHtml={question.answerc} 
                isVisible={showAnswerC} 
                onToggle={(e) => { e.stopPropagation(); setShowAnswerC(!showAnswerC); }} 
                language={language}
                questionId={question.id}
              />
            )}

            {question.questiond && (
              <QuestionPart 
                label="d)" 
                questionHtml={question.questiond} 
                answerHtml={question.answerd} 
                isVisible={showAnswerD} 
                onToggle={(e) => { e.stopPropagation(); setShowAnswerD(!showAnswerD); }} 
                language={language}
                questionId={question.id}
              />
            )}

            {question.questione && (
              <QuestionPart 
                label="e)" 
                questionHtml={question.questione} 
                answerHtml={question.answere} 
                isVisible={showAnswerE} 
                onToggle={(e) => { e.stopPropagation(); setShowAnswerE(!showAnswerE); }} 
                language={language}
                questionId={question.id}
              />
            )}

            {question.questionf && (
              <QuestionPart 
                label="f)" 
                questionHtml={question.questionf} 
                answerHtml={question.answerf} 
                isVisible={showAnswerF} 
                onToggle={(e) => { e.stopPropagation(); setShowAnswerF(!showAnswerF); }} 
                language={language}
                questionId={question.id}
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
