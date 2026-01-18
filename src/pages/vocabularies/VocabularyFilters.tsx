import { useState } from 'react'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { VocabularyFilters as Filters } from '@/shared/data/types'
import './VocabularyFilters.css'

interface VocabularyFiltersProps {
  filters: Filters
  onFilterChange: (filters: Filters) => void
}

export default function VocabularyFilters({ filters, onFilterChange }: VocabularyFiltersProps) {
  const { language } = useAppSettings()
  const [isOpen, setIsOpen] = useState(false)

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
    onFilterChange({ page: 0, size: 20 })
  }

  return (
    <div className="vocabulary-filters-wrapper">
      <button 
        className="filters-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('toggleFilters', language)}
      >
        🔍 {isOpen ? t('hideFilters', language) : t('showFilters', language)}
      </button>

      {isOpen && (
        <div className="vocabulary-filters">
          <div className="filters-grid">
            {/* Term Filter */}
            <div className="filter-group">
              <label htmlFor="term-filter">{t('term', language)}</label>
              <input
                id="term-filter"
                type="number"
                min="1"
                placeholder={t('enterTerm', language)}
                value={filters.term ?? ''}
                onChange={(e) => handleChange('term', e.target.value ? parseInt(e.target.value) : '')}
                className="filter-input"
              />
            </div>

            {/* Week Filter */}
            <div className="filter-group">
              <label htmlFor="week-filter">{t('week', language)}</label>
              <input
                id="week-filter"
                type="number"
                min="1"
                placeholder={t('enterWeek', language)}
                value={filters.week ?? ''}
                onChange={(e) => handleChange('week', e.target.value ? parseInt(e.target.value) : '')}
                className="filter-input"
              />
            </div>

            {/* Difficulty Level Filter */}
            <div className="filter-group">
              <label htmlFor="difficulty-filter">{t('difficultyLevel', language)}</label>
              <select
                id="difficulty-filter"
                value={filters.difficultyLevel ?? 'all'}
                onChange={(e) => handleChange('difficultyLevel', e.target.value)}
                className="filter-select"
              >
                <option value="all">{t('allLevels', language)}</option>
                <option value="Easy">{t('easy', language)}</option>
                <option value="Medium">{t('medium', language)}</option>
                <option value="Hard">{t('hard', language)}</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="filter-group filter-actions">
              <button onClick={handleReset} className="reset-button">
                🔄 {t('resetFilters', language)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
