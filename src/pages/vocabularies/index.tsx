import { useState, useEffect } from 'react'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import { fetchVocabularies } from '@/shared/data/publicApi'
import type { VocabularyFilters as VocabFilters, Vocabulary } from '@/shared/data/types'
import VocabularyCardCompact from './VocabularyCardCompact'
import VocabularyDetail from './VocabularyDetail'
import VocabularyFilters from './VocabularyFilters'
import Pagination from '@/shared/ui/Pagination'
import './index.css'

export default function VocabulariesPage() {
  const { language } = useAppSettings()
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<VocabFilters>({
    page: 0,
    size: 20
  })
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [selectedVocabulary, setSelectedVocabulary] = useState<Vocabulary | null>(null)

  useEffect(() => {
    loadVocabularies()
  }, [filters])

  const loadVocabularies = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchVocabularies(filters)
      
      if (response.status.code === 200) {
        setVocabularies(response.data.content)
        setTotalPages(response.data.totalPages)
        setTotalElements(response.data.totalElements)
      } else {
        setError(response.status.message || t('error', language))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error', language))
      console.error('Error loading vocabularies:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: VocabFilters) => {
    setFilters(newFilters)
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCardClick = (vocabulary: Vocabulary) => {
    setSelectedVocabulary(vocabulary)
  }

  const handleCloseDetail = () => {
    setSelectedVocabulary(null)
  }

  return (
    <div className="vocabularies-page">
      <div className="vocabularies-header">
        <h1>📚 {t('vocabularies', language)}</h1>
        <p>{t('vocabulariesDesc', language)}</p>
      </div>

      {/* Filters */}
      <VocabularyFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Loading State */}
      {loading && (
        <div className="vocabularies-loading">
          ⏳ {t('loadingVocabularies', language)}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="vocabularies-error">
          ❌ {error}
          <button onClick={loadVocabularies} className="retry-button">
            {t('retry', language)}
          </button>
        </div>
      )}

      {/* Results Info */}
      {!loading && !error && vocabularies.length > 0 && (
        <div className="vocabularies-info">
          {t('showing', language)} {vocabularies.length} {t('of', language)} {totalElements} {t('vocabularies', language)}
        </div>
      )}

      {/* Vocabularies Grid */}
      {!loading && !error && vocabularies.length > 0 && (
        <div className="vocabularies-grid">
          {vocabularies.map((vocab) => (
            <VocabularyCardCompact 
              key={vocab.id} 
              vocabulary={vocab}
              onClick={() => handleCardClick(vocab)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && vocabularies.length === 0 && (
        <div className="vocabularies-empty">
          📭 {t('noVocabularies', language)}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="vocabularies-pagination">
          <Pagination
            currentPage={filters.page ?? 0}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Detail Modal */}
      {selectedVocabulary && (
        <VocabularyDetail 
          vocabulary={selectedVocabulary}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  )
}
