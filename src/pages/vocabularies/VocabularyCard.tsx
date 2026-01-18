import { useState } from 'react'
import type { Vocabulary } from '@/shared/data/types'
import './VocabularyCard.css'

interface VocabularyCardProps {
  vocabulary: Vocabulary
}

export default function VocabularyCard({ vocabulary }: VocabularyCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const playAudio = () => {
    if (vocabulary.phoneticAudioUrl) {
      const audio = new Audio(vocabulary.phoneticAudioUrl)
      setIsPlaying(true)
      audio.play()
      audio.onended = () => setIsPlaying(false)
    }
  }

  const partsOfSpeech = vocabulary.partOfSpeech.split(',').map(p => p.trim())

  const renderHTML = (html: string) => {
    return { __html: html }
  }

  return (
    <div className="vocabulary-card">
      {/* Header */}
      <div className="vocab-header">
        <div className="vocab-title-section">
          <h2 className="vocab-word">{vocabulary.name}</h2>
          {vocabulary.phonetic && (
            <div className="vocab-phonetic">
              <span className="phonetic-text">/{vocabulary.phonetic}/</span>
              {vocabulary.phoneticAudioUrl && (
                <button 
                  className={`audio-button ${isPlaying ? 'playing' : ''}`}
                  onClick={playAudio}
                  aria-label="Play pronunciation"
                >
                  {isPlaying ? '⏸' : '🔊'}
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="vocab-meta">
          <span className="difficulty-badge" data-level={vocabulary.difficultyLevel.toLowerCase()}>
            {vocabulary.difficultyLevel}
          </span>
          <span className="term-badge">Term {vocabulary.term} • Week {vocabulary.week}</span>
        </div>
      </div>

      {/* Image */}
      {vocabulary.imageUrl && (
        <div className="vocab-image-container">
          <img src={vocabulary.imageUrl} alt={vocabulary.name} className="vocab-image" />
        </div>
      )}

      {/* Translation */}
      {vocabulary.translation && (
        <div className="vocab-translation">
          <strong>Translation:</strong> {vocabulary.translation}
        </div>
      )}

      {/* Definition */}
      {vocabulary.definition && (
        <div className="vocab-definition">
          <strong>Definition:</strong>
          <div dangerouslySetInnerHTML={renderHTML(vocabulary.definition)} />
        </div>
      )}

      {/* Example */}
      {vocabulary.example && (
        <div className="vocab-example">
          <strong>Example:</strong>
          <div dangerouslySetInnerHTML={renderHTML(vocabulary.example)} />
        </div>
      )}

      {/* Synonyms */}
      {vocabulary.synonyms && (
        <div className="vocab-synonyms">
          <strong>Synonyms:</strong> {vocabulary.synonyms}
        </div>
      )}

      {/* Parts of Speech */}
      <div className="vocab-parts-of-speech">
        <strong>Parts of Speech:</strong>
        <div className="pos-badges">
          {partsOfSpeech.map((pos, index) => (
            <span key={index} className="pos-badge">{pos}</span>
          ))}
        </div>
      </div>

      {/* Toggle Details Button */}
      <button 
        className="toggle-details-btn"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? '▲ Hide Details' : '▼ Show Details'}
      </button>

      {/* Detailed Forms */}
      {showDetails && (
        <div className="vocab-details">
          {/* Noun Details */}
          {partsOfSpeech.includes('Noun') && vocabulary.nounForm && (
            <div className="detail-section">
              <h3 className="detail-heading">📝 Noun</h3>
              {vocabulary.nounForm && <p><strong>Form:</strong> {vocabulary.nounForm}</p>}
              {vocabulary.nounPluralForm && <p><strong>Plural:</strong> {vocabulary.nounPluralForm}</p>}
              {vocabulary.nounMeaning && (
                <p><strong>Meaning:</strong> {vocabulary.nounMeaning}</p>
              )}
              {vocabulary.nounExample && (
                <p><strong>Example:</strong> {vocabulary.nounExample}</p>
              )}
            </div>
          )}

          {/* Verb Details */}
          {partsOfSpeech.includes('Verb') && vocabulary.verbForm && (
            <div className="detail-section">
              <h3 className="detail-heading">⚡ Verb</h3>
              {vocabulary.verbForm && <p><strong>Form:</strong> {vocabulary.verbForm}</p>}
              {vocabulary.verbSimplePastTense && (
                <p><strong>Simple Past:</strong> {vocabulary.verbSimplePastTense}</p>
              )}
              {vocabulary.verbPastPerfectTense && (
                <p><strong>Past Perfect:</strong> {vocabulary.verbPastPerfectTense}</p>
              )}
              {vocabulary.verbPresentParticiple && (
                <p><strong>Present Participle:</strong> {vocabulary.verbPresentParticiple}</p>
              )}
              {vocabulary.verbMeaning && (
                <div>
                  <strong>Meaning:</strong>
                  <div dangerouslySetInnerHTML={renderHTML(vocabulary.verbMeaning)} />
                </div>
              )}
              {vocabulary.verbExample && (
                <div>
                  <strong>Example:</strong>
                  <div dangerouslySetInnerHTML={renderHTML(vocabulary.verbExample)} />
                </div>
              )}
            </div>
          )}

          {/* Adjective Details */}
          {partsOfSpeech.includes('Adjective') && vocabulary.adjectiveForm && (
            <div className="detail-section">
              <h3 className="detail-heading">🎨 Adjective</h3>
              {vocabulary.adjectiveForm && <p><strong>Form:</strong> {vocabulary.adjectiveForm}</p>}
              {vocabulary.adjectiveComparativeForm && (
                <p><strong>Comparative:</strong> {vocabulary.adjectiveComparativeForm}</p>
              )}
              {vocabulary.adjectiveSuperlativeForm && (
                <p><strong>Superlative:</strong> {vocabulary.adjectiveSuperlativeForm}</p>
              )}
              {vocabulary.adjectiveMeaning && (
                <div>
                  <strong>Meaning:</strong>
                  <div dangerouslySetInnerHTML={renderHTML(vocabulary.adjectiveMeaning)} />
                </div>
              )}
              {vocabulary.adjectiveExample && (
                <div>
                  <strong>Example:</strong>
                  <div dangerouslySetInnerHTML={renderHTML(vocabulary.adjectiveExample)} />
                </div>
              )}
            </div>
          )}

          {/* Adverb Details */}
          {partsOfSpeech.includes('Adverb') && vocabulary.adverbForm && (
            <div className="detail-section">
              <h3 className="detail-heading">🌟 Adverb</h3>
              {vocabulary.adverbForm && <p><strong>Form:</strong> {vocabulary.adverbForm}</p>}
              {vocabulary.adverbMeaning && (
                <div>
                  <strong>Meaning:</strong>
                  <div dangerouslySetInnerHTML={renderHTML(vocabulary.adverbMeaning)} />
                </div>
              )}
              {vocabulary.adverbExample && (
                <div>
                  <strong>Example:</strong>
                  <div dangerouslySetInnerHTML={renderHTML(vocabulary.adverbExample)} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="vocab-footer">
        {vocabulary.tags && (
          <div className="vocab-tags">
            {vocabulary.tags.split(',').map((tag, index) => (
              <span key={index} className="tag">{tag.trim()}</span>
            ))}
          </div>
        )}
        {vocabulary.dictionaryUrl && (
          <a 
            href={vocabulary.dictionaryUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="dictionary-link"
          >
            📖 View in Dictionary
          </a>
        )}
      </div>
    </div>
  )
}
