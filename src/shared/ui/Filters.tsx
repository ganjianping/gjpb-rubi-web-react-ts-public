import { useState, ReactNode } from 'react'
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
}

const Icons = {
  Filter: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Reset: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 3v5h5" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
  customContent
}: FiltersProps<T>) {
  const { language } = useAppSettings()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleChange = (key: string, value: string | number) => {
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
  }

  const handleReset = () => {
    onReset()
  }

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
            <div className="tags-scroll-area">
              {tags.map((tag) => (
                <button
                  key={tag}
                  className={`tag-chip ${selectedTags.includes(tag) ? 'active' : ''}`}
                  onClick={() => onTagSelect?.(tag)}
                >
                  <Icons.Tag />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="header-actions">
          <button 
            onClick={handleReset}
            title={t('resetFilters', language)}
            className="action-btn"
          >
            <Icons.Reset />
          </button>
          {(filterFields && filterFields.length > 0) || customContent ? (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? t('hideFilters', language) : t('showFilters', language)}
              className={`action-btn ${isExpanded ? 'active' : ''}`}
            >
              {isExpanded ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="var(--text-inverse)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <Icons.Filter />
              )}
            </button>
          ) : null}
        </div>
      </div>

      {/* Expandable Filters Section */}
      {((filterFields && filterFields.length > 0) || customContent) && (
        <div className={`filters-panel ${isExpanded ? 'expanded' : ''}`}>
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
      )}
    </div>
  )
}
