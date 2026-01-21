import { useState } from 'react'
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
  
  // Toggle states for collapsible sections
  const [showPartOfSpeech, setShowPartOfSpeech] = useState(true)
  const [showPlural, setShowPlural] = useState(true)
  const [showVerbTenses, setShowVerbTenses] = useState(true)
  const [showComparative, setShowComparative] = useState(true)
  const [showSynonyms, setShowSynonyms] = useState(true)
  const [showDefinition, setShowDefinition] = useState(true)
  const [showExample, setShowExample] = useState(true)
  const [showNounDetails, setShowNounDetails] = useState(true)
  const [showVerbDetails, setShowVerbDetails] = useState(true)
  const [showAdjectiveDetails, setShowAdjectiveDetails] = useState(true)
  const [showAdverbDetails, setShowAdverbDetails] = useState(true)

  // Check if all sections are currently expanded
  const allExpanded = showPartOfSpeech && showPlural && showVerbTenses && showComparative && 
                      showSynonyms && showDefinition && showExample && showNounDetails && showVerbDetails && 
                      showAdjectiveDetails && showAdverbDetails

  const handleToggleAll = () => {
    const newState = !allExpanded
    setShowPartOfSpeech(newState)
    setShowPlural(newState)
    setShowVerbTenses(newState)
    setShowComparative(newState)
    setShowSynonyms(newState)
    setShowDefinition(newState)
    setShowExample(newState)
    setShowNounDetails(newState)
    setShowVerbDetails(newState)
    setShowAdjectiveDetails(newState)
    setShowAdverbDetails(newState)
  }

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
  
  // Toggle button component
  const ToggleButton = ({ isOpen, onClick }: { isOpen: boolean, onClick: () => void }) => (
    <button className="toggle-btn" onClick={onClick} type="button" aria-label={isOpen ? 'Hide' : 'Show'}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {isOpen ? (
          <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        ) : (
          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        )}
      </svg>
    </button>
  )

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="vocabulary-detail-overlay" onClick={handleBackdropClick}>
      <div className="vocabulary-detail-modal">
        <div className="detail-actions">
          <button className="detail-action-btn detail-close-btn" onClick={onClose} aria-label="Close">✕</button>
          <button 
            className="detail-action-btn" 
            onClick={handleToggleAll} 
            title={allExpanded ? t('collapseAll', language) : t('expandAll', language)}
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {allExpanded ? (
                <path d="M8 5L12 9L16 5M8 19L12 15L16 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <path d="M8 9L12 5L16 9M8 15L12 19L16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              )}
            </svg>
          </button>
        </div>
        
        <div className="detail-content">
          {/* Header with Image */}
          <div className="detail-header-wrapper">
            <div className="detail-header-text">
              {/* First Row: Name */}
              <h1 className="detail-word">{vocabulary.name}</h1>
              
              {/* Second Row: Phonetic and Audio */}
              {vocabulary.phonetic && (
                <div className="detail-phonetic-row">
                  <span className="detail-phonetic">/{vocabulary.phonetic}/</span>
                  {vocabulary.phoneticAudioUrl && (
                    <button className="detail-audio-btn" onClick={playAudio} title="Play pronunciation">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor"/>
                        <path d="M15.54 8.46a5 5 0 010 7.07M18.07 5.93a9 9 0 010 12.73" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Image */}
            {vocabulary.imageUrl && (
              <div className="detail-image-container">
                <img src={vocabulary.imageUrl} alt={vocabulary.name} />
              </div>
            )}
          </div>
          
          {/* Parts of Speech */}
          <div className="detail-section-toggle">
            <div className="section-header">
              <h3>{t('partsOfSpeech', language)}</h3>
              <ToggleButton isOpen={showPartOfSpeech} onClick={() => setShowPartOfSpeech(!showPartOfSpeech)} />
            </div>
            {showPartOfSpeech && (
              <div className="detail-pos-badges">
                {partsOfSpeech.map((pos, index) => (
                  <span key={index} className="detail-pos-badge">{pos}</span>
                ))}
              </div>
            )}
          </div>
          
          {/* Plural Form */}
          {vocabulary.nounPluralForm && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>{t('plural', language)}</h3>
                <ToggleButton isOpen={showPlural} onClick={() => setShowPlural(!showPlural)} />
              </div>
              {showPlural && <p>{vocabulary.nounPluralForm}</p>}
            </div>
          )}
          
          {/* Verb Tenses */}
          {vocabulary.verbSimplePastTense && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>Verb Tenses</h3>
                <ToggleButton isOpen={showVerbTenses} onClick={() => setShowVerbTenses(!showVerbTenses)} />
              </div>
              {showVerbTenses && (
                <div>
                  {vocabulary.verbSimplePastTense && (
                    <p><strong>{t('simplePast', language)}:</strong> {vocabulary.verbSimplePastTense}</p>
                  )}
                  {vocabulary.verbPastPerfectTense && (
                    <p><strong>{t('pastPerfect', language)}:</strong> {vocabulary.verbPastPerfectTense}</p>
                  )}
                  {vocabulary.verbPresentParticiple && (
                    <p><strong>{t('presentParticiple', language)}:</strong> {vocabulary.verbPresentParticiple}</p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Comparative/Superlative Forms */}
          {vocabulary.adjectiveComparativeForm && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>Comparative & Superlative</h3>
                <ToggleButton isOpen={showComparative} onClick={() => setShowComparative(!showComparative)} />
              </div>
              {showComparative && (
                <div>
                  {vocabulary.adjectiveComparativeForm && (
                    <p><strong>{t('comparative', language)}:</strong> {vocabulary.adjectiveComparativeForm}</p>
                  )}
                  {vocabulary.adjectiveSuperlativeForm && (
                    <p><strong>{t('superlative', language)}:</strong> {vocabulary.adjectiveSuperlativeForm}</p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Synonyms */}
          {vocabulary.synonyms && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>{t('synonyms', language)}</h3>
                <ToggleButton isOpen={showSynonyms} onClick={() => setShowSynonyms(!showSynonyms)} />
              </div>
              {showSynonyms && <p>{vocabulary.synonyms}</p>}
            </div>
          )}

          {/* Definition */}
          {vocabulary.definition && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>{t('definition', language)}</h3>
                <ToggleButton isOpen={showDefinition} onClick={() => setShowDefinition(!showDefinition)} />
              </div>
              {showDefinition && (
                <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.definition)} />
              )}
            </div>
          )}

          {/* Example */}
          {vocabulary.example && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>{t('example', language)}</h3>
                <ToggleButton isOpen={showExample} onClick={() => setShowExample(!showExample)} />
              </div>
              {showExample && (
                <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.example)} />
              )}
            </div>
          )}

          {/* Noun Details */}
          {vocabulary.nounForm && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>📝 {t('noun', language)}</h3>
                <ToggleButton isOpen={showNounDetails} onClick={() => setShowNounDetails(!showNounDetails)} />
              </div>
              {showNounDetails && (
                <div>
                  {vocabulary.nounForm && <p><strong>{t('form', language)}:</strong> {vocabulary.nounForm}</p>}
                  {vocabulary.nounMeaning && (
                    <div>
                      <strong>{t('meaning', language)}:</strong>
                      <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.nounMeaning)} />
                    </div>
                  )}
                  {vocabulary.nounExample && (
                    <div>
                      <strong>{t('example', language)}:</strong>
                      <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.nounExample)} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Verb Details */}
          {vocabulary.verbForm && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>⚡ {t('verb', language)}</h3>
                <ToggleButton isOpen={showVerbDetails} onClick={() => setShowVerbDetails(!showVerbDetails)} />
              </div>
              {showVerbDetails && (
                <div>
                  {vocabulary.verbForm && <p><strong>{t('form', language)}:</strong> {vocabulary.verbForm}</p>}
                  {vocabulary.verbMeaning && (
                    <div>
                      <strong>{t('meaning', language)}:</strong>
                      <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.verbMeaning)} />
                    </div>
                  )}
                  {vocabulary.verbExample && (
                    <div>
                      <strong>{t('example', language)}:</strong>
                      <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.verbExample)} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Adjective Details */}
          {vocabulary.adjectiveForm && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>🎨 {t('adjective', language)}</h3>
                <ToggleButton isOpen={showAdjectiveDetails} onClick={() => setShowAdjectiveDetails(!showAdjectiveDetails)} />
              </div>
              {showAdjectiveDetails && (
                <div>
                  {vocabulary.adjectiveForm && <p><strong>{t('form', language)}:</strong> {vocabulary.adjectiveForm}</p>}
                  {vocabulary.adjectiveMeaning && (
                    <div>
                      <strong>{t('meaning', language)}:</strong>
                      <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.adjectiveMeaning)} />
                    </div>
                  )}
                  {vocabulary.adjectiveExample && (
                    <div>
                      <strong>{t('example', language)}:</strong>
                      <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.adjectiveExample)} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Adverb Details */}
          {vocabulary.adverbForm && (
            <div className="detail-section-toggle">
              <div className="section-header">
                <h3>🌟 {t('adverb', language)}</h3>
                <ToggleButton isOpen={showAdverbDetails} onClick={() => setShowAdverbDetails(!showAdverbDetails)} />
              </div>
              {showAdverbDetails && (
                <div>
                  {vocabulary.adverbForm && <p><strong>{t('form', language)}:</strong> {vocabulary.adverbForm}</p>}
                  {vocabulary.adverbMeaning && (
                    <div>
                      <strong>{t('meaning', language)}:</strong>
                      <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.adverbMeaning)} />
                    </div>
                  )}
                  {vocabulary.adverbExample && (
                    <div>
                      <strong>{t('example', language)}:</strong>
                      <div className="detail-html" dangerouslySetInnerHTML={renderHTML(vocabulary.adverbExample)} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Meta Information */}
          <div className="detail-meta-info">
            {vocabulary.tags && (
              <div className="detail-tags">
                {vocabulary.tags.split(',').map((tag, index) => (
                  <span key={index} className="detail-tag">{tag.trim()}</span>
                ))}
              </div>
            )}
            <span className="detail-difficulty" data-level={vocabulary.difficultyLevel?.toLowerCase()}>
              {vocabulary.difficultyLevel}
            </span>
            <span className="detail-meta-item">
              {t('term', language)} {vocabulary.term}
            </span>
            <span className="detail-meta-item">
              {t('week', language)} {vocabulary.week}
            </span>
            {vocabulary.displayOrder && (
              <span className="detail-meta-item">
                Order: {vocabulary.displayOrder}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="detail-footer">
            
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
