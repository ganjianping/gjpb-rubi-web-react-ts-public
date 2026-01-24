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

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (sentence.phoneticAudioUrl) {
      // Clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      
      audioRef.current = new Audio(sentence.phoneticAudioUrl)
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
            {sentence.phoneticAudioUrl && (
                <button 
                  className="sentence-card-audio"
                  onClick={playAudio}
                  aria-label={t('playPronunciation', language)}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/>
                    <path d="M15.54 8.46a5 5 0 010 7.07M18.07 5.93a9 9 0 010 12.73" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
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