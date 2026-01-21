import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import { fetchSentences, fetchAppSettings } from '@/shared/data/publicApi'
import type { SentenceFilters, Sentence, AppSetting } from '@/shared/data/types'
import SentenceCard from './SentenceCard'
import Filters from '@/shared/ui/Filters'
import Pagination from '@/shared/ui/Pagination'
import './index.css'

export default function SentencesPage() {
  const { language, getSettingValue } = useAppSettings()
  const [sentences, setSentences] = useState<Sentence[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [appSettings, setAppSettings] = useState<AppSetting[]>([])
  const initialFilters = useMemo(() => ({
    page: 0,
    size: 20,
    sort: 'displayOrder' as const,
    direction: 'asc' as const
  }), [])
  
  const [filters, setFilters] = useState<SentenceFilters>(initialFilters)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  // Use ref to track if component is mounted
  const isMountedRef = useRef(true)
  
  // Get sentence tags from app settings
  const sentenceTags = useMemo(() => {
    const tagSetting = appSettings.find(
      (setting) => setting.name === 'sentence_ru_tags' && setting.lang === language
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
  
  // Use useCallback for loadSentences to prevent recreation
  const loadSentences = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchSentences({ ...filters, lang: language })
      
      // Only update state if component is still mounted
      if (!isMountedRef.current) return
      
      if (response.status.code === 200) {
        setSentences(response.data.content)
        setTotalPages(response.data.totalPages)
        setTotalElements(response.data.totalElements)
      } else {
        setError(response.status.message || t('error', language))
      }
    } catch (err) {
      if (!isMountedRef.current) return
      setError(err instanceof Error ? err.message : t('error', language))
      console.error('Error loading sentences:', err)
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [filters, language])

  useEffect(() => {
    loadSentences()
  }, [loadSentences])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const handleFilterChange = (newFilters: SentenceFilters) => {
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
    setFilters({
      page: 0,
      size: 20,
      sort: 'displayOrder',
      direction: 'asc'
    })
    setSelectedTags([])
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageSizeChange = (size: number) => {
    setFilters({ ...filters, size, page: 0 })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="sentences-page">
      {/* Header and Filters */}
      <Filters
        title={t('sentences', language)}
        filters={filters}
        onFilterChange={handleFilterChange}
        filterFields={filterFields}
        tags={sentenceTags}
        selectedTags={selectedTags}
        onTagSelect={handleTagClick}
        onReset={handleReset}
        totalElements={totalElements}
      />

      {/* Loading State */}
      {loading && (
        <div className="sentences-loading">
          ⏳ {t('loadingSentences', language)}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="sentences-error">
          ❌ {error}
          <button onClick={loadSentences} className="retry-button">
            {t('retry', language)}
          </button>
        </div>
      )}

      {/* Sentences Grid */}
      {!loading && !error && sentences.length > 0 && (
        <div className="sentences-grid">
          {sentences.map((sentence, index) => (
            <SentenceCard 
              key={sentence.id} 
              sentence={sentence}
              allSentences={sentences}
              currentIndex={index}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && sentences.length === 0 && (
        <div className="sentences-empty">
          📭 {t('noSentences', language)}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && sentences.length > 0 && (
        <div className="sentences-pagination">
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