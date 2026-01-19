import { useState } from 'react'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { VocabularyFilters as Filters } from '@/shared/data/types'
import './VocabularyFilters.css'

interface VocabularyFiltersProps {
  filters: Filters
  onFilterChange: (filters: Filters) => void
  tags: string[]
  selectedTags: string[]
  onTagSelect: (tag: string) => void
  onReset: () => void
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

export default function VocabularyFilters({ 
  filters, 
  onFilterChange, 
  tags, 
  selectedTags, 
  onTagSelect, 
  onReset 
}: VocabularyFiltersProps) {
  const { language, getSettingValue } = useAppSettings()
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Get difficulty levels from app settings
  const difficultyLevels = getSettingValue('difficulty_level')?.split(',').map(level => level.trim()) || []

  const handleChange = (key: keyof Filters, value: string | number) => {
    const newFilters = { ...filters }
    
    if (value === '' || value === 'all') {
      delete newFilters[key]
    } else {
      (newFilters as any)[key] = value
    }
    
    // Reset to first page when filters change
    newFilters.page = 0
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    onReset()
    // Optionally close filters or keep them open? Let's keep user state.
  }

  return (
    <div className="vocabulary-filters-container">
      {/* Header Section: Title, Tags, Actions */}
      <div className="vocabulary-header">
        <div className="header-left">
          <h2 className="page-title">{t('vocabularies', language)}</h2>
          <div className="tags-scroll-area">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`tag-chip ${selectedTags.includes(tag) ? 'active' : ''}`}
                onClick={() => onTagSelect(tag)}
              >
                <Icons.Tag />
                <span>{tag}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            onClick={handleReset}
            title={t('resetFilters', language)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              backgroundColor: 'var(--bg-secondary)',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Icons.Reset />
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? t('hideFilters', language) : t('showFilters', language)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: isExpanded ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
              cursor: 'pointer',
              backgroundColor: isExpanded ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {/* When expanded (blue bg), we need white icon. When collapsed (gray bg), we need blue icon. 
                We can achieve this by passing a prop or using currentColor with different logic.
                Since Icons.Filter has hardcoded accent-primary stroke, it will be BLUE.
                Blue on Blue background is INVISIBLE. 
                Fix: Use a different icon for active state or change stroke dynamically.
            */}
            {isExpanded ? (
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="var(--text-inverse)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <Icons.Filter />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Filters Section */}
      <div className={`filters-panel ${isExpanded ? 'expanded' : ''}`}>
        <div className="filters-grid">
          {/* Term Filter */}
          <div className="filter-group">
            <label htmlFor="term-filter">{t('term', language)}</label>
            <div className="select-wrapper">
              <select
                id="term-filter"
                value={filters.term ?? 'all'}
                onChange={(e) => handleChange('term', e.target.value === 'all' ? '' : parseInt(e.target.value))}
                className="filter-select"
              >
                <option value="all">{t('all', language)}</option>
                {[1, 2, 3, 4].map(term => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
              <div className="select-arrow"><Icons.ChevronDown /></div>
            </div>
          </div>

          {/* Week Filter */}
          <div className="filter-group">
            <label htmlFor="week-filter">{t('week', language)}</label>
            <div className="select-wrapper">
              <select
                id="week-filter"
                value={filters.week ?? 'all'}
                onChange={(e) => handleChange('week', e.target.value === 'all' ? '' : parseInt(e.target.value))}
                className="filter-select"
              >
                <option value="all">{t('all', language)}</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(week => (
                  <option key={week} value={week}>{week}</option>
                ))}
              </select>
              <div className="select-arrow"><Icons.ChevronDown /></div>
            </div>
          </div>

          {/* Difficulty Level Filter */}
          <div className="filter-group">
            <label htmlFor="difficulty-filter">{t('difficultyLevel', language)}</label>
            <div className="select-wrapper">
              <select
                id="difficulty-filter"
                value={filters.difficultyLevel ?? 'all'}
                onChange={(e) => handleChange('difficultyLevel', e.target.value)}
                className="filter-select"
              >
                <option value="all">{t('allLevels', language)}</option>
                {difficultyLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <div className="select-arrow"><Icons.ChevronDown /></div>
            </div>
          </div>

          {/* Sort Filter */}
          <div className="filter-group">
            <label htmlFor="sort-filter">{t('sortBy', language)}</label>
            <div className="select-wrapper">
              <select
                id="sort-filter"
                value={filters.sort ?? 'displayOrder'}
                onChange={(e) => handleChange('sort', e.target.value)}
                className="filter-select"
              >
                <option value="displayOrder">{t('displayOrder', language)}</option>
                <option value="name">{t('name', language)}</option>
                <option value="updatedAt">{t('updatedAt', language)}</option>
                <option value="difficultyLevel">{t('difficultyLevel', language)}</option>
              </select>
              <div className="select-arrow"><Icons.ChevronDown /></div>
            </div>
          </div>

          {/* Direction Filter */}
          <div className="filter-group">
            <label htmlFor="direction-filter">{t('sortDirection', language)}</label>
            <div className="select-wrapper">
              <select
                id="direction-filter"
                value={filters.direction ?? 'asc'}
                onChange={(e) => handleChange('direction', e.target.value)}
                className="filter-select"
              >
                <option value="asc">{t('ascending', language)}</option>
                <option value="desc">{t('descending', language)}</option>
              </select>
              <div className="select-arrow"><Icons.ChevronDown /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
