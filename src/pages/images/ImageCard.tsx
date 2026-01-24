import { useState } from 'react'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { Image } from '@/shared/data/types'
import './ImageCard.css'

interface ImageCardProps {
  readonly image: Image
  readonly onClick?: () => void
}

export default function ImageCard({ image, onClick }: ImageCardProps) {
  const { language } = useAppSettings()
  const [imageError, setImageError] = useState(false)

  const handleImageClick = () => {
    onClick?.()
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <>
      <div className="image-card expanded">
        {/* Image Container */}
        <div 
          className="image-card-media" 
          onClick={handleImageClick}
          onKeyDown={(e) => e.key === 'Enter' && handleImageClick()}
          role="button"
          tabIndex={0}
        >
          {imageError ? (
            <div className="image-error-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor" opacity="0.3"/>
              </svg>
              <span>{t('imageLoadError', language)}</span>
            </div>
          ) : (
            <img 
              src={image.thumbnailFileUrl} 
              alt={image.altText || image.name}
              loading="lazy"
              onError={handleImageError}
            />
          )}
          <button 
            className="image-zoom-overlay"
            onClick={handleImageClick}
            type="button"
            aria-label={`${t('viewFull', language)} ${image.name}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="image-card-overlay-title">
            <h3>{image.name}</h3>
          </div>
        </div>
      </div>
    </>
  )
}
