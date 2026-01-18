import { useState, ChangeEvent } from 'react'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  initialValue?: string
}

function SearchBar({ onSearch, placeholder, initialValue = '' }: SearchBarProps) {
  const { language } = useAppSettings()
  const defaultPlaceholder = placeholder || t('searchPlaceholder', language)
  const [query, setQuery] = useState(initialValue)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={defaultPlaceholder}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          border: '1px solid #ccc',
          fontSize: '1rem',
          flex: 1,
          minWidth: '200px',
        }}
      />
      <button
        type="submit"
        style={{
          padding: '0.5rem 1.5rem',
          borderRadius: '6px',
          border: '1px solid #646cff',
          backgroundColor: '#646cff',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        {t('search', language)}
      </button>
    </form>
  )
}

export default SearchBar
