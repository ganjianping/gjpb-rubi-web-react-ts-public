import { useState } from 'react'
import type { Vocabulary } from '@/shared/data/types'
import VocabularyDetail from './VocabularyDetail'
import './VocabularyCard.css'

interface VocabularyCardProps {
  readonly vocabulary: Vocabulary
}

export default function VocabularyCard({ vocabulary }: VocabularyCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (vocabulary.phoneticAudioUrl) {
      const audio = new Audio(vocabulary.phoneticAudioUrl)
      audio.play()
    }
  }

  const handleCardClick = () => {
    setShowDetailModal(true)
  }

  return (
    <>
      <button 
        className="vocabulary-card"
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        type="button"
        aria-label={`View details for ${vocabulary.name}`}
      >
        {/* Always visible: Name */}
        <h3 className="vocab-card-word">{vocabulary.name}</h3>
        
        {/* Show on hover: Phonetic and Audio */}
        {isHovered && (
          <div className="vocab-card-hover-content">
            {vocabulary.phonetic && (
              <div className="vocab-card-phonetic">
                <span className="phonetic-text">/{vocabulary.phonetic}/</span>
              </div>
            )}
            {vocabulary.phoneticAudioUrl && (
              <button 
                className="vocab-card-audio"
                onClick={playAudio}
                aria-label="Play pronunciation"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        )}
      </button>

      {/* Detail Modal */}
      {showDetailModal && (
        <VocabularyDetail 
          vocabulary={vocabulary} 
          onClose={() => setShowDetailModal(false)} 
        />
      )}
    </>
  )
}
