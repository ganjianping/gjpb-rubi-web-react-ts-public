import { useState } from 'react'
import DOMPurify from 'dompurify'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { MultipleChoiceQuestion } from '@/shared/data/types'
import MultipleChoiceQuestionDetail from './MultipleChoiceQuestionDetail'
import './MultipleChoiceQuestionCard.css'

interface MultipleChoiceQuestionCardProps {
  readonly question: MultipleChoiceQuestion
  readonly isExpandedView?: boolean
  readonly allQuestions?: MultipleChoiceQuestion[]
  readonly currentIndex?: number
}

// Utility function to strip HTML and truncate text
const stripHtmlAndTruncate = (html: string, maxLength: number = 100): string => {
  // Strip HTML tags
  const stripped = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] })
  // Truncate if too long
  if (stripped.length <= maxLength) return stripped
  return stripped.substring(0, maxLength).trim() + '...'
}

// Utility function to render HTML safely
const renderHTML = (html: string) => {
  return { __html: DOMPurify.sanitize(html) }
}

export default function MultipleChoiceQuestionCard({ question, isExpandedView = true, allQuestions = [], currentIndex = 0 }: MultipleChoiceQuestionCardProps) {
  const { language } = useAppSettings()
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(currentIndex)

  const handleCardClick = () => {
    setActiveQuestionIndex(currentIndex)
    setShowDetailModal(true)
  }

  const handlePrevious = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (activeQuestionIndex < allQuestions.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1)
    }
  }

  const currentQuestion = allQuestions.length > 0 ? allQuestions[activeQuestionIndex] : question

  return (
    <>
      <button 
        className={`mcq-card ${isExpandedView ? 'expanded' : 'compact'}`}
        onClick={handleCardClick}
        type="button"
        aria-label={`${t('viewDetails', language)} ${stripHtmlAndTruncate(question.question, 50)}`}
      >
        {/* Question content */}
        <div className="mcq-card-content">
          {/* Question text */}
          <div className="mcq-card-question" dangerouslySetInnerHTML={renderHTML(question.question)} />
          
          {/* Options preview */}
          <div className="mcq-card-options">
            <div className="mcq-option-preview">
              <span className="option-letter">A</span>
              <span className="option-text" dangerouslySetInnerHTML={renderHTML(stripHtmlAndTruncate(question.optionA, 60))} />
            </div>
            <div className="mcq-option-preview">
              <span className="option-letter">B</span>
              <span className="option-text" dangerouslySetInnerHTML={renderHTML(stripHtmlAndTruncate(question.optionB, 60))} />
            </div>
            <div className="mcq-option-preview">
              <span className="option-letter">C</span>
              <span className="option-text" dangerouslySetInnerHTML={renderHTML(stripHtmlAndTruncate(question.optionC, 60))} />
            </div>
            <div className="mcq-option-preview">
              <span className="option-letter">D</span>
              <span className="option-text" dangerouslySetInnerHTML={renderHTML(stripHtmlAndTruncate(question.optionD, 60))} />
            </div>
          </div>
          
          {/* Metadata */}
          <div className="mcq-card-meta">
            <span className="mcq-card-difficulty" data-level={question.difficultyLevel?.toLowerCase()}>
              {question.difficultyLevel}
            </span>
            {question.tags && (
              <span className="mcq-card-tag">{question.tags.split(',')[0].trim()}</span>
            )}
          </div>
        </div>
      </button>

      {/* Detail Modal */}
      {showDetailModal && (
        <MultipleChoiceQuestionDetail 
          question={currentQuestion} 
          onClose={() => setShowDetailModal(false)}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={activeQuestionIndex > 0}
          hasNext={activeQuestionIndex < allQuestions.length - 1}
        />
      )}
    </>
  )
}
