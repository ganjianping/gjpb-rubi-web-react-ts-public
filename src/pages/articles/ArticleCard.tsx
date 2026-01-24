import { useNavigate } from 'react-router-dom'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { Article } from '@/shared/data/types'
import './ArticleCard.css'

interface ArticleCardProps {
  readonly article: Article
  readonly isExpandedView?: boolean
}

export default function ArticleCard({ article, isExpandedView = true }: ArticleCardProps) {
  const { language } = useAppSettings()
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/articles/${article.id}`)
  }

  return (
    <button 
      className={`article-card ${isExpandedView ? 'expanded' : 'compact'}`}
      onClick={handleCardClick}
      type="button"
      aria-label={`${t('viewDetails', language)} ${article.title}`}
    >
        {/* Cover Image */}
        {article.coverImageFileUrl && (
          <div className="article-card-image">
            <img src={article.coverImageFileUrl} alt={article.title} loading="lazy" />
          </div>
        )}
        
        {/* Content */}
        <div className="article-card-content">
          {/* Title */}
          <h3 className="article-card-title">{article.title}</h3>
          
          {/* Summary */}
          {isExpandedView && article.summary && (
            <p className="article-card-summary">{article.summary}</p>
          )}
          
          {/* Tags */}
          {isExpandedView && article.tags && (
            <div className="article-card-tags">
              {article.tags.split(',').map((tag) => (
                <span key={tag} className="article-card-tag">{tag.trim()}</span>
              ))}
            </div>
          )}
        </div>
      </button>
  )
}
