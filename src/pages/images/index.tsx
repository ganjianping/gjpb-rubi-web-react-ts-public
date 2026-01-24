import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import { fetchImages, fetchAppSettings } from '@/shared/data/publicApi'
import type { ImageFilters, Image, AppSetting } from '@/shared/data/types'
import ImageCard from './ImageCard'
import Filters from '@/shared/ui/Filters'
import Pagination from '@/shared/ui/Pagination'
import { SkeletonGrid } from '@/shared/ui/Skeleton'
import './index.css'

export default function ImagesPage() {
  const { language } = useAppSettings()
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [fullViewImageIndex, setFullViewImageIndex] = useState<number | null>(null)
  const [appSettings, setAppSettings] = useState<AppSetting[]>([])
  
  // Use useMemo for initial filters to prevent recreation on every render
  const initialFilters = useMemo(() => ({
    page: 0,
    size: 20,
    sort: 'displayOrder' as const,
    direction: 'asc' as const
  }), [])
  
  const [filters, setFilters] = useState<ImageFilters>(initialFilters)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  // Use ref to track if component is mounted
  const isMountedRef = useRef(true)
  
  // Get image tags from app settings
  const imageTags = useMemo(() => {
    const tagSetting = appSettings.find(
      (setting) => setting.name === 'image_ru_tags' && setting.lang === language
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
  
  // Use useCallback for loadImages to prevent recreation
  const loadImages = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchImages({ ...filters, lang: language })
      
      // Only update state if component is still mounted
      if (!isMountedRef.current) return
      
      if (response.status.code === 200) {
        setImages(response.data.content)
        setTotalPages(response.data.totalPages)
        setTotalElements(response.data.totalElements)
      } else {
        setError(response.status.message || t('error', language))
      }
    } catch (err) {
      if (!isMountedRef.current) return
      setError(err instanceof Error ? err.message : t('error', language))
      console.error('Error loading images:', err)
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [filters, language])

  useEffect(() => {
    loadImages()
  }, [loadImages])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const handleFilterChange = (newFilters: ImageFilters) => {
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

  const handlePageSizeChange = (size: number) => {
    setFilters({ ...filters, size, page: 0 })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCloseFullView = () => {
    setFullViewImageIndex(null)
  }

  const handlePreviousImage = () => {
    if (fullViewImageIndex !== null && fullViewImageIndex > 0) {
      setFullViewImageIndex(fullViewImageIndex - 1)
    }
  }

  const handleNextImage = () => {
    if (fullViewImageIndex !== null && fullViewImageIndex < images.length - 1) {
      setFullViewImageIndex(fullViewImageIndex + 1)
    }
  }

  return (
    <div className="images-page">
      {/* Header and Filters */}
      <Filters
        title={t('images', language)}
        filters={filters}
        onFilterChange={handleFilterChange}
        filterFields={filterFields}
        tags={imageTags}
        selectedTags={selectedTags}
        onTagSelect={handleTagClick}
        onReset={handleReset}
        totalElements={totalElements}
      />

      {/* Loading State */}
      {loading && (
        <SkeletonGrid count={filters.size || 20} />
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="images-error">
          ❌ {error}
          <button onClick={loadImages} className="retry-button">
            {t('retry', language)}
          </button>
        </div>
      )}

      {/* Images Grid */}
      {!loading && !error && images.length > 0 && (
        <div className="images-grid">
          {images.map((image, index) => (
            <ImageCard 
              key={image.id} 
              image={image}
              onClick={() => setFullViewImageIndex(index)}
            />
          ))}
        </div>
      )}
      {/* Empty State */}
      {!loading && !error && images.length === 0 && (
        <div className="images-empty">
          📭 {t('noImages', language)}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && images.length > 0 && (
        <div className="images-pagination">
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

      {/* Full View Modal */}
      {fullViewImageIndex !== null && images[fullViewImageIndex] && (
        <div 
          className="image-fullview-overlay" 
          onClick={handleCloseFullView}
          onKeyDown={(e) => e.key === 'Escape' && handleCloseFullView()}
          role="button"
          tabIndex={0}
          aria-label={t('close', language)}
        >
          <div className="image-fullview-container">
            <button 
              className="image-fullview-close"
              onClick={handleCloseFullView}
              type="button"
              aria-label={t('close', language)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* Previous Button */}
            {fullViewImageIndex > 0 && (
              <button 
                className="image-fullview-nav image-fullview-prev"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePreviousImage()
                }}
                type="button"
                aria-label={t('previous', language)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            
            {/* Next Button */}
            {fullViewImageIndex < images.length - 1 && (
              <button 
                className="image-fullview-nav image-fullview-next"
                onClick={(e) => {
                  e.stopPropagation()
                  handleNextImage()
                }}
                type="button"
                aria-label={t('next', language)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            
            <img 
              src={images[fullViewImageIndex].fileUrl} 
              alt={images[fullViewImageIndex].altText || images[fullViewImageIndex].name}
            />
            <div className="image-fullview-info">
              <h3>{images[fullViewImageIndex].name}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
