import { useState, useRef, useEffect } from 'react'
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
        aria-label={`${t('viewDetails', language)} ${sentence.name}`}
      >
        {/* First row: Name */}
        <h3 className="sentence-card-word">{sentence.name}</h3>
        
        {/* Second row: Phonetic (if available) */}
        {isExpandedView && sentence.phonetic && (
          <div className="sentence-card-phonetic-row">
            <div className="sentence-card-phonetic">
              <span className="phonetic-text">/{sentence.phonetic}/</span>
            </div>
          </div>
        )}
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