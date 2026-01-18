import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import { fetchVocabularies, fetchAppSettings } from '@/shared/data/publicApi'
import type { VocabularyFilters as VocabFilters, Vocabulary, AppSetting } from '@/shared/data/types'
import VocabularyCardCompact from './VocabularyCardCompact'
import VocabularyDetail from './VocabularyDetail'
import VocabularyFilters from './VocabularyFilters'
import Pagination from '@/shared/ui/Pagination'
import './index.css'

export default function VocabulariesPage() {
  const { language } = useAppSettings()
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [selectedVocabulary, setSelectedVocabulary] = useState<Vocabulary | null>(null)
  const [appSettings, setAppSettings] = useState<AppSetting[]>([])
  const [showFilters, setShowFilters] = useState(false)
  
  // Use useMemo for initial filters to prevent recreation on every render
  const initialFilters = useMemo(() => ({
    page: 0,
    size: 20
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
      const response = await fetchVocabularies(filters)
      
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
    setFilters({ page: 0, size: 20 })
    setSelectedTags([])
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCardClick = (vocabulary: Vocabulary) => {
    setSelectedVocabulary(vocabulary)
  }

  const handleCloseDetail = () => {
    setSelectedVocabulary(null)
  }

  return (
    <div className="vocabularies-page">
      {/* Header with Tags and Filter Button */}
      <div className="vocabularies-header-tags">
        <div className="vocabularies-header-content">
          <h2>{t('vocabularies', language)}:</h2>
          <div className="vocabularies-tags-container">
            {vocabularyTags.map((tag, index) => (
              <span 
                key={index} 
                className={`vocabulary-tag ${selectedTags.includes(tag) ? 'vocabulary-tag-selected' : ''}`}
                onClick={() => handleTagClick(tag)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleTagClick(tag)
                  }
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="vocabularies-header-actions">
          <button 
            className="vocabularies-reset-btn"
            onClick={handleReset}
            aria-label={t('resetFilters', language)}
            title={t('resetFilters', language)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
            </svg>
          </button>
          <button 
            className="vocabularies-filter-btn"
            onClick={() => setShowFilters(!showFilters)}
            aria-label={t('toggleFilters', language)}
            title={showFilters ? t('hideFilters', language) : t('showFilters', language)}
          >
            🔍
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && <VocabularyFilters filters={filters} onFilterChange={handleFilterChange} />}

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

      {/* Results Info */}
      {!loading && !error && vocabularies.length > 0 && (
        <div className="vocabularies-info">
          {t('showing', language)} {vocabularies.length} {t('of', language)} {totalElements} {t('vocabularies', language)}
        </div>
      )}

      {/* Vocabularies Grid */}
      {!loading && !error && vocabularies.length > 0 && (
        <div className="vocabularies-grid">
          {vocabularies.map((vocab) => (
            <VocabularyCardCompact 
              key={vocab.id} 
              vocabulary={vocab}
              onClick={() => handleCardClick(vocab)}
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
      {!loading && !error && totalPages > 1 && (
        <div className="vocabularies-pagination">
          <Pagination
            currentPage={filters.page ?? 0}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Detail Modal */}
      {selectedVocabulary && (
        <VocabularyDetail 
          vocabulary={selectedVocabulary}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  )
}
