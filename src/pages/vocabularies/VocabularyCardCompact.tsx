import type { Vocabulary } from '@/shared/data/types'
import './VocabularyCardCompact.css'

interface VocabularyCardCompactProps {
  vocabulary: Vocabulary
  onClick: () => void
}

export default function VocabularyCardCompact({ vocabulary, onClick }: VocabularyCardCompactProps) {
  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (vocabulary.phoneticAudioUrl) {
      const audio = new Audio(vocabulary.phoneticAudioUrl)
      audio.play()
    }
  }

  return (
    <div className="vocabulary-card-compact" onClick={onClick}>
      <div className="vocab-compact-header">
        <h3 className="vocab-compact-word">{vocabulary.name}</h3>
        {vocabulary.phoneticAudioUrl && (
          <button 
            className="vocab-compact-audio"
            onClick={playAudio}
            aria-label="Play pronunciation"
          >
            🔊
          </button>
        )}
      </div>
      
      {vocabulary.phonetic && (
        <div className="vocab-compact-phonetic">/{vocabulary.phonetic}/</div>
      )}
      
      {vocabulary.translation && (
        <div className="vocab-compact-translation">{vocabulary.translation}</div>
      )}
      
      <div className="vocab-compact-footer">
        <span className="vocab-compact-difficulty" data-level={vocabulary.difficultyLevel.toLowerCase()}>
          {vocabulary.difficultyLevel}
        </span>
      </div>
    </div>
  )
}
