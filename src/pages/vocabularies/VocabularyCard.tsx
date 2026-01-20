import { useState } from 'react'
import type { Vocabulary } from '@/shared/data/types'
import VocabularyDetail from './VocabularyDetail'
import './VocabularyCard.css'

interface VocabularyCardProps {
  readonly vocabulary: Vocabulary
  readonly isExpandedView?: boolean
}

export default function VocabularyCard({ vocabulary, isExpandedView = true }: VocabularyCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false)

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
        className={`vocabulary-card ${isExpandedView ? 'expanded' : 'compact'}`}
        onClick={handleCardClick}
        type="button"
        aria-label={`View details for ${vocabulary.name}`}
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
                aria-label="Play pronunciation"
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
          vocabulary={vocabulary} 
          onClose={() => setShowDetailModal(false)} 
        />
      )}
    </>
  )
}
