import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { VocabularyFilters as Filters } from '@/shared/data/types'
import './VocabularyFilters.css'

interface VocabularyFiltersProps {
  filters: Filters
  onFilterChange: (filters: Filters) => void
}

export default function VocabularyFilters({ filters, onFilterChange }: VocabularyFiltersProps) {
  const { language, getSettingValue } = useAppSettings()
  
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

  return (
    <div className="vocabulary-filters-wrapper">
      <div className="vocabulary-filters">
          <div className="filters-grid">
            {/* Term Filter */}
            <div className="filter-group">
              <label htmlFor="term-filter">{t('term', language)}</label>
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
            </div>

            {/* Week Filter */}
            <div className="filter-group">
              <label htmlFor="week-filter">{t('week', language)}</label>
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
                {difficultyLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
    </div>
  )
}
