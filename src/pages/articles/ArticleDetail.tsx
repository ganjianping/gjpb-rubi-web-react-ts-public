import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import { fetchArticleById } from '@/shared/data/publicApi'
import type { Article } from '@/shared/data/types'
import { SkeletonDetail } from '@/shared/ui/Skeleton'
import './ArticleDetail.css'

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { language } = useAppSettings()
  
  // Check if article data was passed via navigation state
  const passedArticle = location.state?.article as Article | undefined
  
  const [article, setArticle] = useState<Article | null>(passedArticle || null)
  const [loading, setLoading] = useState(!passedArticle)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If article data was passed via state and has content, don't fetch again
    if (passedArticle?.content) {
      setArticle(passedArticle)
      setLoading(false)
      return
    }

    const loadArticle = async () => {
      if (!id) {
        setError(t('articleNotFound', language))
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await fetchArticleById(id)
        setArticle(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('error', language))
        console.error('Error loading article:', err)
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [id, language, passedArticle])

  const handleBack = () => {
    navigate('/articles')
  }

  const handlePrint = () => {
    window.print()
  }

  const renderHTML = (html: string) => {
    return { __html: DOMPurify.sanitize(html) }
  }

  // Loading State
  if (loading) {
    return <SkeletonDetail />
  }

  // Error State
  if (error || !article) {
    return (
      <div className="article-detail-error">
        <div className="error-content">
          <h1>❌ {error || t('articleNotFound', language)}</h1>
          <button onClick={handleBack} className="back-button">
            ← {t('backToArticles', language)}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="article-detail-page">
      {/* Action Bar - Hidden in print */}
      <div className="article-actions no-print">
        <button onClick={handleBack} className="action-btn back-btn" title={t('back', language)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{t('back', language)}</span>
        </button>
        
        <button onClick={handlePrint} className="action-btn print-btn" title={t('print', language)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 14h12v8H6v-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{t('print', language)}</span>
        </button>
      </div>

      {/* Article Container */}
      <article className="article-container">
        {/* Article Header */}
        <header className="article-header">
          <h1 className="article-title">{article.title}</h1>
          
          {article.summary && (
            <div className="article-summary">
              <p>{article.summary}</p>
            </div>
          )}

          {/* Meta Info - Visible in print */}
          <div className="article-meta-brief">
            {article.tags && (
              <div className="meta-tags">
                {article.tags.split(',').map((tag) => (
                  <span key={tag} className="meta-tag">{tag.trim()}</span>
                ))}
              </div>
            )}
            <div className="meta-info-inline">
              {article.sourceName && <span className="meta-source">{article.sourceName}</span>}
              {article.term && <span className="meta-item">{t('term', language)} {article.term}</span>}
              {article.week && <span className="meta-item">{t('week', language)} {article.week}</span>}
              <span className="meta-date">{article.updatedAt}</span>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="article-content" dangerouslySetInnerHTML={renderHTML(article.content)} />
      </article>
    </div>
  )
}
