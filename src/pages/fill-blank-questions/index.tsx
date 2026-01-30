import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import { fetchFillBlankQuestions, fetchAppSettings } from '@/shared/data/publicApi'
import type { FillBlankQuestionFilters, FillBlankQuestion, AppSetting } from '@/shared/data/types'
import FillBlankQuestionCard from './FillBlankQuestionCard'
import { generatePrintExamSheet, openPrintWindow } from './printExamSheet'
import Filters from '@/shared/ui/Filters'
import Pagination from '@/shared/ui/Pagination'
import { SkeletonGrid } from '@/shared/ui/Skeleton'
import './index.css'

export default function FillBlankQuestionsPage() {
  const { language, getSettingValue } = useAppSettings()
  const [questions, setQuestions] = useState<FillBlankQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [appSettings, setAppSettings] = useState<AppSetting[]>([])
  const initialFilters = useMemo(() => ({
    page: 0,
    size: 20,
    sort: 'displayOrder' as const,
    direction: 'asc' as const
  }), [])
  
  const [filters, setFilters] = useState<FillBlankQuestionFilters>(initialFilters)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isExpandedView, setIsExpandedView] = useState(false)
  const [showPrintDialog, setShowPrintDialog] = useState(false)
  const [printOptions, setPrintOptions] = useState({ showAnswer: false, showExplanation: false })
  
  const isMountedRef = useRef(true)
  
  const questionTags = useMemo(() => {
    const tagSetting = appSettings.find(
      (setting) => setting.name === 'question_ru_tags' && setting.lang === language
    )
    return tagSetting ? tagSetting.value.split(',').map((tag) => tag.trim()) : []
  }, [appSettings, language])
  
  const difficultyLevels = useMemo(() => {
    return getSettingValue('difficulty_level')?.split(',').map(level => level.trim()) || []
  }, [getSettingValue])
  
  const filterFields = useMemo(() => [
    {
      id: 'term',
      label: t('term', language),
      type: 'select' as const,
      options: [1, 2, 3, 4].map(term => ({ value: term, label: `${term}` }))
    },
    {
      id: 'week',
      label: t('week', language),
      type: 'select' as const,
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(week => ({ value: week, label: `${week}` }))
    },
    {
      id: 'difficultyLevel',
      label: t('difficultyLevel', language),
      type: 'select' as const,
      options: difficultyLevels.map(level => ({ value: level, label: level }))
    },
    {
      id: 'sort',
      label: t('sortBy', language),
      type: 'select' as const,
      options: [
        { value: 'displayOrder', label: t('displayOrder', language) },
        { value: 'updatedAt', label: t('updatedAt', language) },
        { value: 'difficultyLevel', label: t('difficultyLevel', language) },
        { value: 'successCount', label: t('successCount', language) },
        { value: 'failCount', label: t('failCount', language) }
      ]
    },
    {
      id: 'direction',
      label: t('sortDirection', language),
      type: 'select' as const,
      options: [
        { value: 'asc', label: t('ascending', language) },
        { value: 'desc', label: t('descending', language) }
      ]
    }
  ], [language, difficultyLevels])
  
  useEffect(() => {
    const loadAppSettings = async () => {
      try {
        const settings = await fetchAppSettings()
        if (isMountedRef.current) {
          setAppSettings(settings)
        }
      } catch (err) {
        console.error('Error loading app settings:', err)
      }
    }
    
    loadAppSettings()
  }, [])
  
  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchFillBlankQuestions({ ...filters, lang: language })
      
      if (!isMountedRef.current) return
      
      if (response.status.code === 200) {
        setQuestions(response.data.content)
        setTotalPages(response.data.totalPages)
        setTotalElements(response.data.totalElements)
      } else {
        setError(response.status.message || t('error', language))
      }
    } catch (err) {
      if (!isMountedRef.current) return
      setError(err instanceof Error ? err.message : t('error', language))
      console.error('Error loading questions:', err)
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [filters, language])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const handleFilterChange = (newFilters: FillBlankQuestionFilters) => {
    setFilters(newFilters)
  }

  const handleTagClick = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    
    setSelectedTags(newSelectedTags)
    const tagsString = newSelectedTags.length > 0 ? newSelectedTags.join(',') : undefined
    setFilters({ ...filters, tags: tagsString, page: 0 })
  }

  const handleReset = () => {
    setFilters({
      page: 0,
      size: 20,
      sort: 'displayOrder',
      direction: 'asc'
    })
    setSelectedTags([])
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageSizeChange = (size: number) => {
    setFilters({ ...filters, size, page: 0 })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleToggleView = () => {
    setIsExpandedView(prev => !prev)
  }

  const handleShowPrintDialog = () => {
    setShowPrintDialog(true)
  }

  const handlePrintExam = () => {
    const htmlContent = generatePrintExamSheet({
      questions,
      title: t('fillBlankQuestions', language),
      language,
      showAnswer: printOptions.showAnswer,
      showExplanation: printOptions.showExplanation
    })
    openPrintWindow(htmlContent)
    setShowPrintDialog(false)
  }

  return (
    <div className="fbq-page">
      <Filters
        title={t('questions', language)}
        filters={filters}
        onFilterChange={handleFilterChange}
        filterFields={filterFields}
        tags={questionTags}
        selectedTags={selectedTags}
        onTagSelect={handleTagClick}
        onReset={handleReset}
        totalElements={totalElements}
        customActions={
          <>
            <button 
              onClick={handleShowPrintDialog}
              title={t('printExamSheet', language)}
              aria-label={t('printExamSheet', language)}
              className="action-btn"
              type="button"
              disabled={questions.length === 0}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9V2h12v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="6" y="14" width="12" height="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              onClick={handleToggleView}
              title={isExpandedView ? t('showCompactView', language) : t('showDetailedView', language)}
              aria-label={isExpandedView ? t('showCompactView', language) : t('showDetailedView', language)}
              className={`action-btn ${isExpandedView ? 'active' : ''}`}
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {isExpandedView ? (
                  <g>
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </g>
                ) : (
                  <g>
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="6" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="6" y1="16" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </g>
                )}
              </svg>
            </button>
          </>
        }
      />

      {loading && <SkeletonGrid count={filters.size || 20} type="sentence" />}

      {error && !loading && (
        <div className="fbq-error">
          ❌ {error}
          <button onClick={loadQuestions} className="retry-button">
            {t('retry', language)}
          </button>
        </div>
      )}

      {!loading && !error && questions.length > 0 && (
        <div className="fbq-grid">
          {questions.map((question) => (
            <FillBlankQuestionCard 
              key={question.id} 
              question={question}
              isExpandedView={isExpandedView}
            />
          ))}
        </div>
      )}

      {!loading && !error && questions.length === 0 && (
        <div className="fbq-empty">
          📭 {t('noQuestions', language)}
        </div>
      )}

      {!loading && !error && questions.length > 0 && (
        <div className="fbq-pagination">
          <Pagination
            currentPage={(filters.page ?? 0) + 1}
            totalPages={totalPages}
            onPageChange={(page) => handlePageChange(page - 1)}
            pageSize={filters.size ?? 20}
            onPageSizeChange={handlePageSizeChange}
            totalElements={totalElements}
          />
        </div>
      )}

      {showPrintDialog && (
        <div className="print-dialog-overlay" onClick={() => setShowPrintDialog(false)}>
          <div className="print-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>{t('printOptions', language)}</h3>
            <div className="print-options">
              <label>
                <input
                  type="checkbox"
                  checked={printOptions.showAnswer}
                  onChange={(e) => setPrintOptions(prev => ({ ...prev, showAnswer: e.target.checked }))}
                />
                {t('showAnswer', language)}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={printOptions.showExplanation}
                  onChange={(e) => setPrintOptions(prev => ({ ...prev, showExplanation: e.target.checked }))}
                />
                {t('showExplanation', language)}
              </label>
            </div>
            <div className="print-dialog-actions">
              <button onClick={() => setShowPrintDialog(false)} className="cancel-btn">
                {t('cancel', language)}
              </button>
              <button onClick={handlePrintExam} className="print-btn">
                {t('print', language)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
