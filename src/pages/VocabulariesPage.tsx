import { useState, useEffect } from 'react'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import { fetchVocabularies } from '@/shared/data/publicApi'
import type { VocabularyFilters, Vocabulary } from '@/shared/data/types'
import VocabularyCard from './vocabularies/VocabularyCard'
import VocabularyFilters from './vocabularies/VocabularyFilters'
import Pagination from '@/shared/ui/Pagination'

function VocabulariesPage() {
  const { language } = useAppSettings()
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<VocabularyFilters>({
    term: 1,
    week: 4,
    lang: 'EN',
    difficultyLevel: 'Hard',
    page: 0,
    size: 20
  })
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

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
        setError(response.status.message || 'Failed to load vocabularies')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading vocabularies')
      console.error('Error loading vocabularies:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: VocabularyFilters) => {
    setFilters(newFilters)
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto',
      padding: '2rem'
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        marginBottom: '1rem',
        color: 'var(--text-primary)'
      }}>
        📚 {t('vocabularies', language)}
      </h1>
      <p style={{ 
        fontSize: '1.1rem', 
        color: 'var(--text-secondary)',
        lineHeight: '1.6',
        marginBottom: '2rem'
      }}>
        {t('vocabulariesDesc', language)}
      </p>

      {/* Filters */}
      <VocabularyFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Loading State */}
      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          fontSize: '1.25rem',
          color: 'var(--text-secondary)'
        }}>
          ⏳ Loading vocabularies...
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div style={{ 
          background: '#fee',
          color: '#c33',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #fcc'
        }}>
          ❌ {error}
          <button 
            onClick={loadVocabularies}
            style={{
              marginLeft: '1rem',
              padding: '0.5rem 1rem',
              background: '#c33',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Results Info */}
      {!loading && !error && vocabularies.length > 0 && (
        <div style={{
          marginBottom: '1.5rem',
          color: 'var(--text-secondary)',
          fontSize: '0.95rem'
        }}>
          Showing {vocabularies.length} of {totalElements} vocabularies
        </div>
      )}

      {/* Vocabularies List */}
      {!loading && !error && vocabularies.length > 0 && (
        <div>
          {vocabularies.map((vocab) => (
            <VocabularyCard key={vocab.id} vocabulary={vocab} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && vocabularies.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          fontSize: '1.1rem',
          color: 'var(--text-secondary)'
        }}>
          📭 No vocabularies found. Try adjusting your filters.
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div style={{ marginTop: '2rem' }}>
          <Pagination
            currentPage={filters.page ?? 0}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

export default VocabulariesPage

