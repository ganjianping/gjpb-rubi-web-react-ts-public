import { useState, useMemo, useCallback, ReactNode } from 'react'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import './Filters.css'

export interface FilterField {
  id: string
  label: string
  type: 'select' | 'input' | 'number'
  options?: { value: string | number; label: string }[]
  value?: string | number
  placeholder?: string
}

export interface FiltersProps<T = any> {
  title: string
  filters: T
  onFilterChange: (filters: T) => void
  filterFields?: FilterField[]
  tags?: string[]
  selectedTags?: string[]
  onTagSelect?: (tag: string) => void
  onReset: () => void
  totalElements?: number
  customContent?: ReactNode
  customActions?: ReactNode
}

const Icons = {
  Filter: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Reset: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Tag: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Filters<T = any>({ 
  title,
  filters, 
  onFilterChange,
  filterFields,
  tags, 
  selectedTags = [], 
  onTagSelect, 
  onReset,
  totalElements,
  customContent,
  customActions
}: FiltersProps<T>) {
  const { language } = useAppSettings()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleChange = useCallback((key: string, value: string | number) => {
    const newFilters = { ...filters }
    
    if (value === '' || value === 'all') {
      delete (newFilters as any)[key]
    } else {
      (newFilters as any)[key] = value
    }
    
    // Reset to first page when filters change (if page property exists)
    const filtersObj = newFilters as any
    if (filtersObj && typeof filtersObj === 'object' && 'page' in filtersObj) {
      filtersObj.page = 0
    }
    onFilterChange(newFilters)
  }, [filters, onFilterChange])

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  const handleReset = useCallback(() => {
    setIsExpanded(false)
    onReset()
  }, [onReset])

  const hasFilterContent = useMemo(() => {
    return (filterFields && filterFields.length > 0) || customContent
  }, [filterFields, customContent])

  return (
    <div className="filters-container">
      {/* Header Section: Title, Tags, Actions */}
      <div className="filters-header">
        <div className="header-left">
          <h2 className="page-title">
            {title}
            {totalElements !== undefined && (
              <span className="title-count-badge">
                {totalElements}
              </span>
            )}
          </h2>
          {tags && tags.length > 0 && (
            <div className="tags-scroll-area" role="group" aria-label="Filter tags">
              {tags.map((tag) => {
                const isActive = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    className={`tag-chip ${isActive ? 'active' : ''}`}
                    onClick={() => onTagSelect?.(tag)}
                    aria-pressed={isActive}
                    aria-label={`Filter by ${tag}`}
                    type="button"
                  >
                    <Icons.Tag />
                    <span>{tag}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
        
        <div className="header-actions">
          {customActions}
          <button 
            onClick={handleReset}
            title={t('resetFilters', language)}
            aria-label={t('resetFilters', language)}
            className="action-btn"
            type="button"
          >
            <Icons.Reset />
          </button>
          {hasFilterContent && (
            <button 
              onClick={toggleExpanded}
              title={isExpanded ? t('hideFilters', language) : t('showFilters', language)}
              aria-label={isExpanded ? t('hideFilters', language) : t('showFilters', language)}
              aria-expanded={isExpanded}
              aria-controls="filters-panel"
              className={`action-btn ${isExpanded ? 'active' : ''}`}
              type="button"
            >
              <Icons.Filter />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Filters Section */}
      {hasFilterContent && (
        <div 
          id="filters-panel"
          className={`filters-panel ${isExpanded ? 'expanded' : ''}`}
          role="region"
          aria-label="Advanced filters"
        >
          <div className="filters-panel-inner">
            <div className="filters-content">
              {customContent ? (
                customContent
              ) : (
                <div className="filters-grid">
              {filterFields?.map((field) => (
                <div key={field.id} className="filter-group">
                  <label htmlFor={`${field.id}-filter`}>{field.label}</label>
                  <div className="select-wrapper">
                    {field.type === 'select' ? (
                      <>
                        <select
                          id={`${field.id}-filter`}
                          value={(filters as any)[field.id] ?? 'all'}
                          onChange={(e) => {
                            const value = e.target.value === 'all' ? '' : 
                              (typeof field.options?.[0]?.value === 'number' ? Number.parseInt(e.target.value, 10) : e.target.value)
                            handleChange(field.id, value)
                          }}
                          className="filter-select"
                        >
                          <option value="all">{t('all', language)}</option>
                          {field.options?.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="select-arrow"><Icons.ChevronDown /></div>
                      </>
                    ) : (
                      <input
                        id={`${field.id}-filter`}
                        type={field.type === 'number' ? 'number' : 'text'}
                        value={(filters as any)[field.id] ?? ''}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="filter-input"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
