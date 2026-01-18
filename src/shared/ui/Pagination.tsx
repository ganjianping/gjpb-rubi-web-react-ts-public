import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number
}

function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  maxVisiblePages = 5 
}: PaginationProps) {
  const { language } = useAppSettings()
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2)
      let start = Math.max(1, currentPage - halfVisible)
      let end = Math.min(totalPages, currentPage + halfVisible)

      if (currentPage <= halfVisible) {
        end = maxVisiblePages
      } else if (currentPage + halfVisible >= totalPages) {
        start = totalPages - maxVisiblePages + 1
      }

      if (start > 1) {
        pages.push(1)
        if (start > 2) pages.push('...')
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div style={{ 
      display: 'flex', 
      gap: '0.5rem', 
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          border: '1px solid var(--border-primary)',
          backgroundColor: 'var(--button-bg)',
          color: 'var(--text-primary)',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1,
          transition: 'all 0.2s ease'
        }}
      >
        {t('previous', language)}
      </button>

      {pageNumbers.map((page, index) => (
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: currentPage === page 
                ? '1px solid var(--accent-primary)' 
                : '1px solid var(--border-primary)',
              cursor: 'pointer',
              backgroundColor: currentPage === page 
                ? 'var(--accent-primary)' 
                : 'var(--button-bg)',
              color: currentPage === page 
                ? 'var(--text-inverse)' 
                : 'var(--text-primary)',
              fontWeight: currentPage === page ? 'bold' : 'normal',
              transition: 'all 0.2s ease'
            }}
          >
            {page}
          </button>
        ) : (
          <span 
            key={index} 
            style={{ 
              padding: '0 0.5rem',
              color: 'var(--text-muted)'
            }}
          >
            {page}
          </span>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          border: '1px solid var(--border-primary)',
          backgroundColor: 'var(--button-bg)',
          color: 'var(--text-primary)',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.5 : 1,
          transition: 'all 0.2s ease'
        }}
      >
        {t('next', language)}
      </button>
    </div>
  )
}

export default Pagination
