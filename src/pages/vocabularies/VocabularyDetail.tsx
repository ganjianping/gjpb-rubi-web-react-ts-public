import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { Vocabulary } from '@/shared/data/types'
import './VocabularyDetail.css'

interface VocabularyDetailProps {
  vocabulary: Vocabulary
  onClose: () => void
}

export default function VocabularyDetail({ vocabulary, onClose }: VocabularyDetailProps) {
  const { language } = useAppSettings()

  const playAudio = () => {
    if (vocabulary.phoneticAudioUrl) {
      const audio = new Audio(vocabulary.phoneticAudioUrl)
      audio.play()
    }
  }

  const partsOfSpeech = vocabulary.partOfSpeech.split(',').map(p => p.trim())

  const renderHTML = (html: string) => {
    return { __html: html }
  }

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="vocabulary-detail-overlay" onClick={handleBackdropClick}>
      <div className="vocabulary-detail-modal">
        <button className="detail-close-btn" onClick={onClose}>✕</button>
        
        <div className="detail-content">
          {/* Header */}
          <div className="detail-header">
            <div>
              <h1 className="detail-word">{vocabulary.name}</h1>
              {vocabulary.phonetic && (
                <div className="detail-phonetic">
                  <span>/{vocabulary.phonetic}/</span>
                  {vocabulary.phoneticAudioUrl && (
                    <button className="detail-audio-btn" onClick={playAudio} title="Play pronunciation">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor"/>
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className="detail-meta">
              <span className="detail-difficulty" data-level={vocabulary.difficultyLevel.toLowerCase()}>
                {vocabulary.difficultyLevel}
              </span>
              <span className="detail-term-week">
                {t('term', language)} {vocabulary.term} • {t('week', language)} {vocabulary.week}
              </span>
            </div>
          </div>

          {/* Image */}
          {vocabulary.imageUrl && (
            <div className="detail-image-container">
              <img src={vocabulary.imageUrl} alt={vocabulary.name} />
            </div>
          )}

          {/* Translation */}
          {vocabulary.translation && (
            <div className="detail-section">
              <h3>{t('translation', language)}</h3>
              <p className="detail-translation">{vocabulary.translation}</p>
            </div>
          )}

          {/* Definition */}
          {vocabulary.definition && (
            <div className="detail-section">
              <h3>{t('definition', language)}</h3>
              <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.definition)} />
            </div>
          )}

          {/* Example */}
          {vocabulary.example && (
            <div className="detail-section">
              <h3>{t('example', language)}</h3>
              <div className="detail-example" dangerouslySetInnerHTML={renderHTML(vocabulary.example)} />
            </div>
          )}

          {/* Synonyms */}
          {vocabulary.synonyms && (
            <div className="detail-section">
              <h3>{t('synonyms', language)}</h3>
              <p>{vocabulary.synonyms}</p>
            </div>
          )}

          {/* Parts of Speech */}
          <div className="detail-section">
            <h3>{t('partsOfSpeech', language)}</h3>
            <div className="detail-pos-badges">
              {partsOfSpeech.map((pos, index) => (
                <span key={index} className="detail-pos-badge">{pos}</span>
              ))}
            </div>
          </div>

          {/* Detailed Forms */}
          <div className="detail-forms">
            {/* Noun */}
            {partsOfSpeech.includes('Noun') && vocabulary.nounForm && (
              <div className="detail-form-section">
                <h3>📝 {t('noun', language)}</h3>
                {vocabulary.nounForm && <p><strong>{t('form', language)}:</strong> {vocabulary.nounForm}</p>}
                {vocabulary.nounPluralForm && <p><strong>{t('plural', language)}:</strong> {vocabulary.nounPluralForm}</p>}
                {vocabulary.nounMeaning && <p><strong>{t('meaning', language)}:</strong> {vocabulary.nounMeaning}</p>}
                {vocabulary.nounExample && <p><strong>{t('example', language)}:</strong> {vocabulary.nounExample}</p>}
              </div>
            )}

            {/* Verb */}
            {partsOfSpeech.includes('Verb') && vocabulary.verbForm && (
              <div className="detail-form-section">
                <h3>⚡ {t('verb', language)}</h3>
                {vocabulary.verbForm && <p><strong>{t('form', language)}:</strong> {vocabulary.verbForm}</p>}
                {vocabulary.verbSimplePastTense && (
                  <p><strong>{t('simplePast', language)}:</strong> {vocabulary.verbSimplePastTense}</p>
                )}
                {vocabulary.verbPastPerfectTense && (
                  <p><strong>{t('pastPerfect', language)}:</strong> {vocabulary.verbPastPerfectTense}</p>
                )}
                {vocabulary.verbPresentParticiple && (
                  <p><strong>{t('presentParticiple', language)}:</strong> {vocabulary.verbPresentParticiple}</p>
                )}
                {vocabulary.verbMeaning && (
                  <div>
                    <strong>{t('meaning', language)}:</strong>
                    <div dangerouslySetInnerHTML={renderHTML(vocabulary.verbMeaning)} />
                  </div>
                )}
                {vocabulary.verbExample && (
                  <div>
                    <strong>{t('example', language)}:</strong>
                    <div dangerouslySetInnerHTML={renderHTML(vocabulary.verbExample)} />
                  </div>
                )}
              </div>
            )}

            {/* Adjective */}
            {partsOfSpeech.includes('Adjective') && vocabulary.adjectiveForm && (
              <div className="detail-form-section">
                <h3>🎨 {t('adjective', language)}</h3>
                {vocabulary.adjectiveForm && <p><strong>{t('form', language)}:</strong> {vocabulary.adjectiveForm}</p>}
                {vocabulary.adjectiveComparativeForm && (
                  <p><strong>{t('comparative', language)}:</strong> {vocabulary.adjectiveComparativeForm}</p>
                )}
                {vocabulary.adjectiveSuperlativeForm && (
                  <p><strong>{t('superlative', language)}:</strong> {vocabulary.adjectiveSuperlativeForm}</p>
                )}
                {vocabulary.adjectiveMeaning && (
                  <div>
                    <strong>{t('meaning', language)}:</strong>
                    <div dangerouslySetInnerHTML={renderHTML(vocabulary.adjectiveMeaning)} />
                  </div>
                )}
                {vocabulary.adjectiveExample && (
                  <div>
                    <strong>{t('example', language)}:</strong>
                    <div dangerouslySetInnerHTML={renderHTML(vocabulary.adjectiveExample)} />
                  </div>
                )}
              </div>
            )}

            {/* Adverb */}
            {partsOfSpeech.includes('Adverb') && vocabulary.adverbForm && (
              <div className="detail-form-section">
                <h3>🌟 {t('adverb', language)}</h3>
                {vocabulary.adverbForm && <p><strong>{t('form', language)}:</strong> {vocabulary.adverbForm}</p>}
                {vocabulary.adverbMeaning && (
                  <div>
                    <strong>{t('meaning', language)}:</strong>
                    <div dangerouslySetInnerHTML={renderHTML(vocabulary.adverbMeaning)} />
                  </div>
                )}
                {vocabulary.adverbExample && (
                  <div>
                    <strong>{t('example', language)}:</strong>
                    <div dangerouslySetInnerHTML={renderHTML(vocabulary.adverbExample)} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="detail-footer">
            {vocabulary.tags && (
              <div className="detail-tags">
                {vocabulary.tags.split(',').map((tag, index) => (
                  <span key={index} className="detail-tag">{tag.trim()}</span>
                ))}
              </div>
            )}
            {vocabulary.dictionaryUrl && (
              <a 
                href={vocabulary.dictionaryUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="detail-dictionary-link"
              >
                📖 {t('viewInDictionary', language)}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
