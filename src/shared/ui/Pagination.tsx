import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import './Pagination.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number
  pageSize?: number
  onPageSizeChange?: (size: number) => void
  totalElements?: number
}

function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  maxVisiblePages = 5,
  pageSize = 20,
  onPageSizeChange,
  totalElements
}: PaginationProps) {
  const { language } = useAppSettings()
  const pageSizeOptions = [10, 20, 50, 100]
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
    <div className="pagination-container">
      {/* Page Size Selector and Info */}
      <div className="pagination-toolbar">
        {onPageSizeChange && (
          <div className="pagination-size-selector">
            <label htmlFor="page-size">
              {t('itemsPerPage', language)}:
            </label>
            <select
              id="page-size"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="pagination-size-select"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}
        {totalElements !== undefined && (
          <div className="pagination-info">
            {t('showing', language)} <span style={{ color: 'var(--text-primary)' }}>{Math.min((currentPage - 1) * pageSize + 1, totalElements)}</span>-{Math.min(currentPage * pageSize, totalElements)} {t('of', language)} <span style={{ color: 'var(--text-primary)' }}>{totalElements}</span>
          </div>
        )}
      </div>
      
      {/* Page Navigation */}
      <div className="pagination-controls">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button pagination-nav-button"
        >
          {t('previous', language)}
        </button>

        {pageNumbers.map((page, index) => (
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`pagination-button ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="pagination-ellipsis">
              {page}
            </span>
          )
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button pagination-nav-button"
        >
          {t('next', language)}
        </button>
      </div>
    </div>
  )
}

export default Pagination
