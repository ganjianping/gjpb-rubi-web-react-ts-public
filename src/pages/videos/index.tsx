import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import { fetchVideos, fetchAppSettings } from '@/shared/data/publicApi'
import type { VideoFilters, Video, AppSetting } from '@/shared/data/types'
import VideoCard from './VideoCard'
import Filters from '@/shared/ui/Filters'
import Pagination from '@/shared/ui/Pagination'
import { SkeletonGrid } from '@/shared/ui/Skeleton'
import './index.css'

export default function VideosPage() {
  const { language } = useAppSettings()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [appSettings, setAppSettings] = useState<AppSetting[]>([])
  const [isExpandedView, setIsExpandedView] = useState(true)
  
  // Use useMemo for initial filters to prevent recreation on every render
  const initialFilters = useMemo(() => ({
    page: 0,
    size: 20,
    sort: 'displayOrder' as const,
    direction: 'asc' as const
  }), [])
  
  const [filters, setFilters] = useState<VideoFilters>(initialFilters)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  // Use ref to track if component is mounted
  const isMountedRef = useRef(true)
  
  // Get video tags from app settings
  const videoTags = useMemo(() => {
    const tagSetting = appSettings.find(
      (setting) => setting.name === 'video_ru_tags' && setting.lang === language
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
  
  // Use useCallback for loadVideos to prevent recreation
  const loadVideos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchVideos({ ...filters, lang: language })
      
      // Only update state if component is still mounted
      if (!isMountedRef.current) return
      
      if (response.status.code === 200) {
        setVideos(response.data.content)
        setTotalPages(response.data.totalPages)
        setTotalElements(response.data.totalElements)
      } else {
        setError(response.status.message || t('error', language))
      }
    } catch (err) {
      if (!isMountedRef.current) return
      setError(err instanceof Error ? err.message : t('error', language))
      console.error('Error loading videos:', err)
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [filters, language])

  useEffect(() => {
    loadVideos()
  }, [loadVideos])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const handleFilterChange = (newFilters: VideoFilters) => {
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

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageSizeChange = (size: number) => {
    setFilters({ ...filters, size, page: 0 })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="videos-page">
      {/* Header and Filters */}
      <Filters
        title={t('videos', language)}
        filters={filters}
        onFilterChange={handleFilterChange}
        filterFields={filterFields}
        tags={videoTags}
        selectedTags={selectedTags}
        onTagSelect={handleTagClick}
        onReset={handleReset}
        totalElements={totalElements}
        customActions={
          <button 
            onClick={handleToggleView}
            title={isExpandedView ? t('showCompactView', language) : t('showDetailedView', language)}
            aria-label={isExpandedView ? t('showCompactView', language) : t('showDetailedView', language)}
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
        }
      />

      {/* Loading State */}
      {loading && (
        <SkeletonGrid count={filters.size || 20} />
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="videos-error">
          ❌ {error}
          <button onClick={loadVideos} className="retry-button">
            {t('retry', language)}
          </button>
        </div>
      )}

      {/* Videos Grid */}
      {!loading && !error && videos.length > 0 && (
        <div className="videos-grid">
          {videos.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video}
              isExpandedView={isExpandedView}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && videos.length === 0 && (
        <div className="videos-empty">
          📭 {t('noVideos', language)}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && videos.length > 0 && (
        <div className="videos-pagination">
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
