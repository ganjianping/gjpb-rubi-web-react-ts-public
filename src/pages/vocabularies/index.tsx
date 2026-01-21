import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import { fetchVocabularies, fetchAppSettings } from '@/shared/data/publicApi'
import type { VocabularyFilters as VocabFilters, Vocabulary, AppSetting } from '@/shared/data/types'
import VocabularyCard from './VocabularyCard'
import Filters from '@/shared/ui/Filters'
import Pagination from '@/shared/ui/Pagination'
import './index.css'

export default function VocabulariesPage() {
  const { language, getSettingValue } = useAppSettings()
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [appSettings, setAppSettings] = useState<AppSetting[]>([])
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0)
  const [isExpandedView, setIsExpandedView] = useState(true)
  const [showIntervalModal, setShowIntervalModal] = useState(false)
  const [playInterval, setPlayInterval] = useState(5000) // Default 5 seconds
  const autoPlayTimerRef = useRef<number | null>(null)
  const randomOrderRef = useRef<number[]>([])
  
  // Use useMemo for initial filters to prevent recreation on every render
  const initialFilters = useMemo(() => ({
    page: 0,
    size: 20,
    sort: 'displayOrder' as const,
    direction: 'asc' as const
  }), [])
  
  const [filters, setFilters] = useState<VocabFilters>(initialFilters)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  // Use ref to track if component is mounted
  const isMountedRef = useRef(true)
  
  // Get vocabulary tags from app settings
  const vocabularyTags = useMemo(() => {
    const tagSetting = appSettings.find(
      (setting) => setting.name === 'vocabulary_ru_tags' && setting.lang === language
    )
    return tagSetting ? tagSetting.value.split(',').map((tag) => tag.trim()) : []
  }, [appSettings, language])
  
  // Get difficulty levels from app settings
  const difficultyLevels = useMemo(() => {
    return getSettingValue('difficulty_level')?.split(',').map(level => level.trim()) || []
  }, [getSettingValue])
  
  // Prepare filter fields configuration
  const filterFields = useMemo(() => [
    {
      id: 'term',
      label: t('term', language),
      type: 'select' as const,
      options: [1, 2, 3, 4].map(term => ({ value: term, label: `${term}` }))
    },
    {
      id: 'week',
      label: t('week', language),
      type: 'select' as const,
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(week => ({ value: week, label: `${week}` }))
    },
    {
      id: 'partOfSpeech',
      label: t('partOfSpeech', language),
      type: 'select' as const,
      options: [
        { value: 'noun', label: t('noun', language) },
        { value: 'verb', label: t('verb', language) },
        { value: 'adjective', label: t('adjective', language) },
        { value: 'adverb', label: t('adverb', language) },
        { value: 'pronoun', label: t('pronoun', language) },
        { value: 'preposition', label: t('preposition', language) },
        { value: 'conjunction', label: t('conjunction', language) },
        { value: 'interjection', label: t('interjection', language) }
      ]
    },
    {
      id: 'difficultyLevel',
      label: t('difficultyLevel', language),
      type: 'select' as const,
      options: difficultyLevels.map(level => ({ value: level, label: level }))
    },
    {
      id: 'sort',
      label: t('sortBy', language),
      type: 'select' as const,
      options: [
        { value: 'displayOrder', label: t('displayOrder', language) },
        { value: 'name', label: t('name', language) },
        { value: 'updatedAt', label: t('updatedAt', language) },
        { value: 'difficultyLevel', label: t('difficultyLevel', language) }
      ]
    },
    {
      id: 'direction',
      label: t('sortDirection', language),
      type: 'select' as const,
      options: [
        { value: 'asc', label: t('ascending', language) },
        { value: 'desc', label: t('descending', language) }
      ]
    }
  ], [language, difficultyLevels])
  
  // Fetch app settings on component mount
  useEffect(() => {
    const loadAppSettings = async () => {
      try {
        const settings = await fetchAppSettings()
        if (isMountedRef.current) {
          setAppSettings(settings)
        }
      } catch (err) {
        console.error('Error loading app settings:', err)
      }
    }
    
    loadAppSettings()
  }, [])
  
  // Use useCallback for loadVocabularies to prevent recreation
  const loadVocabularies = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchVocabularies({ ...filters, lang: language })
      
      // Only update state if component is still mounted
      if (!isMountedRef.current) return
      
      if (response.status.code === 200) {
        setVocabularies(response.data.content)
        setTotalPages(response.data.totalPages)
        setTotalElements(response.data.totalElements)
      } else {
        setError(response.status.message || t('error', language))
      }
    } catch (err) {
      if (!isMountedRef.current) return
      setError(err instanceof Error ? err.message : t('error', language))
      console.error('Error loading vocabularies:', err)
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [filters, language])

  useEffect(() => {
    loadVocabularies()
  }, [loadVocabularies])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const handleFilterChange = (newFilters: VocabFilters) => {
    setFilters(newFilters)
  }

  const handleTagClick = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    
    setSelectedTags(newSelectedTags)
    
    // Update filters with selected tags
    const tagsString = newSelectedTags.length > 0 ? newSelectedTags.join(',') : undefined
    setFilters({ ...filters, tags: tagsString, page: 0 })
  }

  const handleReset = () => {
    setFilters({ page: 0, size: 20, sort: 'displayOrder', direction: 'asc' })
    setSelectedTags([])
  }

  const handleToggleView = () => {
    setIsExpandedView(prev => !prev)
  }

  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = (array: number[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Auto-play handler
  const handleAutoPlay = () => {
    if (isAutoPlaying) {
      // Stop auto-play
      setIsAutoPlaying(false)
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current)
        autoPlayTimerRef.current = null
      }
    } else {
      // Show interval selection modal
      if (vocabularies.length === 0) return
      setShowIntervalModal(true)
    }
  }

  // Start auto-play with selected interval
  const startAutoPlay = (intervalMs: number) => {
    setPlayInterval(intervalMs)
    setShowIntervalModal(false)
    
    // Create random order
    randomOrderRef.current = shuffleArray(vocabularies.map((_, idx) => idx))
    setCurrentPlayIndex(0)
    setIsAutoPlaying(true)
  }

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying || vocabularies.length === 0) return

    const playVocabulary = () => {
      const randomIdx = randomOrderRef.current[currentPlayIndex]
      const vocab = vocabularies[randomIdx]
      
      if (vocab?.phoneticAudioUrl) {
        const audio = new Audio(vocab.phoneticAudioUrl)
        audio.play().catch(err => console.error('Error playing audio:', err))
      }

      // Schedule next vocabulary
      if (currentPlayIndex < randomOrderRef.current.length - 1) {
        autoPlayTimerRef.current = window.setTimeout(() => {
          setCurrentPlayIndex(prev => prev + 1)
        }, playInterval)
      } else {
        // Finished playing all vocabularies
        setIsAutoPlaying(false)
        setCurrentPlayIndex(0)
      }
    }

    playVocabulary()

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current)
      }
    }
  }, [isAutoPlaying, currentPlayIndex, vocabularies, playInterval])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current)
      }
    }
  }, [])

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageSizeChange = (size: number) => {
    setFilters({ ...filters, size, page: 0 })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="vocabularies-page">
      {/* Interval Selection Modal */}
      {showIntervalModal && (
        <div className="interval-modal-overlay" onClick={() => setShowIntervalModal(false)}>
          <div className="interval-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Select Play Interval</h3>
            <p>Choose how long to wait before playing the next vocabulary:</p>
            <div className="interval-options">
              <button onClick={() => startAutoPlay(3000)} className="interval-btn">
                3 seconds
              </button>
              <button onClick={() => startAutoPlay(5000)} className="interval-btn">
                5 seconds
              </button>
              <button onClick={() => startAutoPlay(8000)} className="interval-btn">
                8 seconds
              </button>
              <button onClick={() => startAutoPlay(10000)} className="interval-btn">
                10 seconds
              </button>
              <button onClick={() => startAutoPlay(15000)} className="interval-btn">
                15 seconds
              </button>
            </div>
            <button onClick={() => setShowIntervalModal(false)} className="interval-cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Header and Filters */}
      <Filters
        title={t('vocabularies', language)}
        filters={filters}
        onFilterChange={handleFilterChange}
        filterFields={filterFields}
        tags={vocabularyTags}
        selectedTags={selectedTags}
        onTagSelect={handleTagClick}
        onReset={handleReset}
        totalElements={totalElements}
        customActions={
          <>
            <button 
              onClick={handleToggleView}
              title={isExpandedView ? 'Show compact view' : 'Show detailed view'}
              aria-label={isExpandedView ? 'Show compact view' : 'Show detailed view'}
              className={`action-btn ${isExpandedView ? 'active' : ''}`}
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {isExpandedView ? (
                  // Compact view icon: single card with minimal content
                  <g>
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </g>
                ) : (
                  // Detailed view icon: card with multiple lines
                  <g>
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="6" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="6" y1="16" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </g>
                )}
              </svg>
            </button>
            <button 
              onClick={handleAutoPlay}
              title={isAutoPlaying ? 'Stop auto-play' : 'Play all vocabularies'}
              aria-label={isAutoPlaying ? 'Stop auto-play' : 'Play all vocabularies'}
              className={`action-btn ${isAutoPlaying ? 'active playing' : ''}`}
              type="button"
              disabled={vocabularies.length === 0}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {isAutoPlaying ? (
                  <rect x="6" y="4" width="4" height="16" fill="currentColor" rx="1" />
                ) : (
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                )}
                {isAutoPlaying ? (
                  <rect x="14" y="4" width="4" height="16" fill="currentColor" rx="1" />
                ) : null}
              </svg>
            </button>
          </>
        }
      />

      {/* Loading State */}
      {loading && (
        <div className="vocabularies-loading">
          ⏳ {t('loadingVocabularies', language)}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="vocabularies-error">
          ❌ {error}
          <button onClick={loadVocabularies} className="retry-button">
            {t('retry', language)}
          </button>
        </div>
      )}

      {/* Vocabularies Grid */}
      {!loading && !error && vocabularies.length > 0 && (
        <div className="vocabularies-grid">
          {vocabularies.map((vocab) => (
            <VocabularyCard 
              key={vocab.id} 
              vocabulary={vocab}
              isExpandedView={isExpandedView}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && vocabularies.length === 0 && (
        <div className="vocabularies-empty">
          📭 {t('noVocabularies', language)}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && vocabularies.length > 0 && (
        <div className="vocabularies-pagination">
          <Pagination
            currentPage={(filters.page ?? 0) + 1}
            totalPages={totalPages}
            onPageChange={(page) => handlePageChange(page - 1)}
            pageSize={filters.size ?? 20}
            onPageSizeChange={handlePageSizeChange}
            totalElements={totalElements}
          />
        </div>
      )}
    </div>
  )
}
