import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import { fetchAudios, fetchAppSettings } from '@/shared/data/publicApi'
import type { AudioFilters, Audio, AppSetting } from '@/shared/data/types'
import AudioCard from './AudioCard'
import AudioPlayerPanel from './AudioPlayerPanel'
import Filters from '@/shared/ui/Filters'
import Pagination from '@/shared/ui/Pagination'
import './index.css'

function AudioSkeleton() {
  return (
    <div className="audio-card">
      <div className="audio-card-row">
        <div className="audio-play-button skeleton" />
        <div className="audio-card-info">
          <div className="audio-card-title skeleton" />
        </div>
      </div>
    </div>
  )
}

function AudioSkeletonGrid({ count = 20 }: { count?: number }) {
  return (
    <div className="audios-grid">
      {Array.from({ length: count }).map((_, index) => (
        <AudioSkeleton key={`audio-skeleton-${index}`} />
      ))}
    </div>
  )
}

export default function AudiosPage() {
  const { language } = useAppSettings()
  const [audios, setAudios] = useState<Audio[]>([])
  const [currentAudio, setCurrentAudio] = useState<Audio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [appSettings, setAppSettings] = useState<AppSetting[]>([])
  
  // Use useMemo for initial filters to prevent recreation on every render
  const initialFilters = useMemo(() => ({
    page: 0,
    size: 20,
    sort: 'displayOrder' as const,
    direction: 'asc' as const
  }), [])
  
  const [filters, setFilters] = useState<AudioFilters>(initialFilters)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  // Use ref to track if component is mounted
  const isMountedRef = useRef(true)
  
  // Get audio tags from app settings
  const audioTags = useMemo(() => {
    const tagSetting = appSettings.find(
      (setting) => setting.name === 'audio_ru_tags' && setting.lang === language
    )
    return tagSetting ? tagSetting.value.split(',').map((tag) => tag.trim()) : []
  }, [appSettings, language])
  
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
      id: 'sort',
      label: t('sortBy', language),
      type: 'select' as const,
      options: [
        { value: 'displayOrder', label: t('displayOrder', language) },
        { value: 'name', label: t('name', language) },
        { value: 'updatedAt', label: t('updatedAt', language) }
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
  ], [language])
  
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
  
  // Use useCallback for loadAudios to prevent recreation
  const loadAudios = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchAudios({ ...filters, lang: language })
      
      // Only update state if component is still mounted
      if (!isMountedRef.current) return
      
      if (response.status.code === 200) {
        setAudios(response.data.content)
        setTotalPages(response.data.totalPages)
        setTotalElements(response.data.totalElements)
      } else {
        setError(response.status.message || t('error', language))
      }
    } catch (err) {
      if (!isMountedRef.current) return
      setError(err instanceof Error ? err.message : t('error', language))
      console.error('Error loading audios:', err)
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [filters, language])

  useEffect(() => {
    loadAudios()
  }, [loadAudios])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const handleFilterChange = (newFilters: AudioFilters) => {
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

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePlayAudio = (audio: Audio) => {
    setCurrentAudio(audio)
  }

  const handleClosePlayer = () => {
    setCurrentAudio(null)
  }

  const handlePageSizeChange = (size: number) => {
    setFilters({ ...filters, size, page: 0 })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="audios-page">
      {/* Header and Filters */}
      <Filters
        title={t('audios', language)}
        filters={filters}
        onFilterChange={handleFilterChange}
        filterFields={filterFields}
        tags={audioTags}
        selectedTags={selectedTags}
        onTagSelect={handleTagClick}
        onReset={handleReset}
        totalElements={totalElements}
      />

      {/* Loading State */}
      {loading && (
        <AudioSkeletonGrid count={filters.size || 20} />
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="audios-error">
          ❌ {error}
          <button onClick={loadAudios} className="retry-button">
            {t('retry', language)}
          </button>
        </div>
      )}

      {/* Audios Grid */}
      {!loading && !error && audios.length > 0 && (
        <div className="audios-grid">
          {audios.map((audio) => (
            <AudioCard 
              key={audio.id} 
              audio={audio}
              onPlay={handlePlayAudio}
              isPlaying={currentAudio?.id === audio.id}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && audios.length === 0 && (
        <div className="audios-empty">
          📭 {t('noAudios', language)}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && audios.length > 0 && (
        <div className="audios-pagination">
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

      {/* Global Audio Player Panel */}
      {currentAudio && (
        <AudioPlayerPanel 
          audio={currentAudio} 
          onClose={handleClosePlayer} 
        />
      )}
    </div>
  )
}
