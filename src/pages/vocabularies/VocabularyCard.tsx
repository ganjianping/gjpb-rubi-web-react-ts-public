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
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.3"/>
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
