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
    <div className="vocabulary-filters">
      <h3 className="filters-title">🔍 {t('filters', language)}</h3>
      
      <div className="filters-grid">
        {/* Term Filter */}
        <div className="filter-group">
          <label htmlFor="term-filter">Term</label>
          <input
            id="term-filter"
            type="number"
            min="1"
            placeholder="Enter term..."
            value={filters.term ?? ''}
            onChange={(e) => handleChange('term', e.target.value ? parseInt(e.target.value) : '')}
            className="filter-input"
          />
        </div>

        {/* Week Filter */}
        <div className="filter-group">
          <label htmlFor="week-filter">Week</label>
          <input
            id="week-filter"
            type="number"
            min="1"
            placeholder="Enter week..."
            value={filters.week ?? ''}
            onChange={(e) => handleChange('week', e.target.value ? parseInt(e.target.value) : '')}
            className="filter-input"
          />
        </div>

        {/* Language Filter */}
        <div className="filter-group">
          <label htmlFor="lang-filter">Language</label>
          <select
            id="lang-filter"
            value={filters.lang ?? 'all'}
            onChange={(e) => handleChange('lang', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Languages</option>
            <option value="EN">English</option>
            <option value="ZH">Chinese</option>
          </select>
        </div>

        {/* Difficulty Level Filter */}
        <div className="filter-group">
          <label htmlFor="difficulty-filter">Difficulty</label>
          <select
            id="difficulty-filter"
            value={filters.difficultyLevel ?? 'all'}
            onChange={(e) => handleChange('difficultyLevel', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Page Size Filter */}
        <div className="filter-group">
          <label htmlFor="size-filter">Items per page</label>
          <select
            id="size-filter"
            value={filters.size ?? 20}
            onChange={(e) => handleChange('size', parseInt(e.target.value))}
            className="filter-select"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="filter-group filter-actions">
          <button onClick={handleReset} className="reset-button">
            🔄 Reset Filters
          </button>
        </div>
      </div>
    </div>
  )
}
