import { useState, useRef, useEffect } from 'react'
import DOMPurify from 'dompurify'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { Sentence } from '@/shared/data/types'
import SentenceDetail from './SentenceDetail'
import './SentenceCard.css'

interface SentenceCardProps {
  readonly sentence: Sentence
  readonly isExpandedView?: boolean
  readonly allSentences?: Sentence[]
  readonly currentIndex?: number
}

// Utility function to strip HTML and truncate text
const stripHtmlAndTruncate = (html: string, maxLength: number = 80): string => {
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

interface SentenceCardProps {
  readonly sentence: Sentence
  readonly isExpandedView?: boolean
  readonly allSentences?: Sentence[]
  readonly currentIndex?: number
}

export default function SentenceCard({ sentence, isExpandedView = true, allSentences = [], currentIndex = 0 }: SentenceCardProps) {
  const { language } = useAppSettings()
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(currentIndex)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
    setActiveSentenceIndex(currentIndex)
    setShowDetailModal(true)
  }

  const handlePrevious = () => {
    if (activeSentenceIndex > 0) {
      setActiveSentenceIndex(activeSentenceIndex - 1)
    }
  }

  const handleNext = () => {
    if (activeSentenceIndex < allSentences.length - 1) {
      setActiveSentenceIndex(activeSentenceIndex + 1)
    }
  }

  const currentSentence = allSentences.length > 0 ? allSentences[activeSentenceIndex] : sentence

  return (
    <>
      <button 
        className={`sentence-card ${isExpandedView ? 'expanded' : 'compact'}`}
        onClick={handleCardClick}
        type="button"
        aria-label={`${t('viewDetails', language)} ${stripHtmlAndTruncate(sentence.name, 50)}`}
      >
        {/* Sentence content */}
        <div className="sentence-card-content">
          {/* Sentence name - full text with HTML support */}
          <div className="sentence-card-text">
            <div className="sentence-card-sentence" dangerouslySetInnerHTML={renderHTML(sentence.name)} />
          </div>
        </div>
      </button>

      {/* Detail Modal */}
      {showDetailModal && (
        <SentenceDetail 
          sentence={currentSentence} 
          onClose={() => setShowDetailModal(false)}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={activeSentenceIndex > 0}
          hasNext={activeSentenceIndex < allSentences.length - 1}
        />
      )}
    </>
  )
}