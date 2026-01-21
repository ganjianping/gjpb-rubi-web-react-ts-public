import { useState, useRef, useEffect } from 'react'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { Vocabulary } from '@/shared/data/types'
import VocabularyDetail from './VocabularyDetail'
import './VocabularyCard.css'

interface VocabularyCardProps {
  readonly vocabulary: Vocabulary
  readonly isExpandedView?: boolean
  readonly allVocabularies?: Vocabulary[]
  readonly currentIndex?: number
}

export default function VocabularyCard({ vocabulary, isExpandedView = true, allVocabularies = [], currentIndex = 0 }: VocabularyCardProps) {
  const { language } = useAppSettings()
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [activeVocabIndex, setActiveVocabIndex] = useState(currentIndex)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (vocabulary.phoneticAudioUrl) {
      // Clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      
      audioRef.current = new Audio(vocabulary.phoneticAudioUrl)
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
    setActiveVocabIndex(currentIndex)
    setShowDetailModal(true)
  }

  const handlePrevious = () => {
    if (activeVocabIndex > 0) {
      setActiveVocabIndex(activeVocabIndex - 1)
    }
  }

  const handleNext = () => {
    if (activeVocabIndex < allVocabularies.length - 1) {
      setActiveVocabIndex(activeVocabIndex + 1)
    }
  }

  const currentVocabulary = allVocabularies.length > 0 ? allVocabularies[activeVocabIndex] : vocabulary

  return (
    <>
      <button 
        className={`vocabulary-card ${isExpandedView ? 'expanded' : 'compact'}`}
        onClick={handleCardClick}
        type="button"
        aria-label={`${t('viewDetails', language)} ${vocabulary.name}`}
      >
        {/* First row: Name */}
        <h3 className="vocab-card-word">{vocabulary.name}</h3>
        
        {/* Second row: Phonetic and Audio */}
        {isExpandedView && vocabulary.phonetic && (
          <div className="vocab-card-phonetic-row">
            <div className="vocab-card-phonetic">
              <span className="phonetic-text">/{vocabulary.phonetic}/</span>
            </div>
            {vocabulary.phoneticAudioUrl && (
              <button 
                className="vocab-card-audio"
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
        
        {/* Third row: Synonyms */}
        {isExpandedView && vocabulary.synonyms && (
          <div className="vocab-card-synonyms">
            <span className="vocab-card-value">{vocabulary.synonyms}</span>
          </div>
        )}
      </button>

      {/* Detail Modal */}
      {showDetailModal && (
        <VocabularyDetail 
          vocabulary={currentVocabulary} 
          onClose={() => setShowDetailModal(false)}
          onPrevious={handlePrevious}
          onNext={handleNext}
          hasPrevious={activeVocabIndex > 0}
          hasNext={activeVocabIndex < allVocabularies.length - 1}
        />
      )}
    </>
  )
}
