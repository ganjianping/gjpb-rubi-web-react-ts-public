import { useState, useRef, useEffect } from 'react'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { Expression } from '@/shared/data/types'
import ExpressionDetail from './ExpressionDetail'
import './ExpressionCard.css'

interface ExpressionCardProps {
  readonly expression: Expression
  readonly isExpandedView?: boolean
  readonly allExpressions?: Expression[]
  readonly currentIndex?: number
}

export default function ExpressionCard({ expression, isExpandedView = true, allExpressions = [], currentIndex = 0 }: ExpressionCardProps) {
  const { language } = useAppSettings()
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [activeExpressionIndex, setActiveExpressionIndex] = useState(currentIndex)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (expression.phoneticAudioUrl) {
      // Clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      
      audioRef.current = new Audio(expression.phoneticAudioUrl)
      audioRef.current.play().catch(err => {
        console.error('Audio playback failed:', err)
      })
    }
  }

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const handleCardClick = () => {
    setActiveExpressionIndex(currentIndex)
    setShowDetailModal(true)
  }

  const handlePrevious = () => {
    if (activeExpressionIndex > 0) {
      setActiveExpressionIndex(activeExpressionIndex - 1)
    }
  }

  const handleNext = () => {
    if (activeExpressionIndex < allExpressions.length - 1) {
      setActiveExpressionIndex(activeExpressionIndex + 1)
    }
  }

  const currentExpression = allExpressions.length > 0 ? allExpressions[activeExpressionIndex] : expression

  return (
    <>
      <button 
        className={`expression-card ${isExpandedView ? 'expanded' : 'compact'}`}
        onClick={handleCardClick}
        type="button"
        aria-label={`${t('viewDetails', language)} ${expression.name}`}
      >
        {/* First row: Name */}
        <h3 className="expression-card-word">{expression.name}</h3>
        
        {/* Second row: Phonetic and Audio */}
        {isExpandedView && expression.phonetic && (
          <div className="expression-card-phonetic-row">
            <div className="expression-card-phonetic">
              <span className="phonetic-text">/{expression.phonetic}/</span>
            </div>
            {expression.phoneticAudioUrl && (
              <button 
                className="expression-card-audio"
                onClick={playAudio}
                aria-label={t('playPronunciation', language)}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/>
                  <path d="M15.54 8.46a5 5 0 010 7.07M18.07 5.93a9 9 0 010 12.73" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        )}
      </button>

      {/* Detail Modal */}
      {showDetailModal && (
        <ExpressionDetail 
          expression={currentExpression} 
          onClose={() => setShowDetailModal(false)}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={activeExpressionIndex > 0}
          hasNext={activeExpressionIndex < allExpressions.length - 1}
        />
      )}
    </>
  )
}
