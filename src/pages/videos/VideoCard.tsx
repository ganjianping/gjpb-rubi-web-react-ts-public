import { useState } from 'react'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { Video } from '@/shared/data/types'
import './VideoCard.css'

interface VideoCardProps {
  readonly video: Video
  readonly isExpandedView?: boolean
}

export default function VideoCard({ video, isExpandedView = true }: VideoCardProps) {
  const { language } = useAppSettings()
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPlaying(true)
  }

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div className={`video-card ${isExpandedView ? 'expanded' : 'compact'} ${isPlaying ? 'playing' : ''}`}>
      {/* Video Player or Cover Image */}
      <div className="video-card-media">
        {isPlaying ? (
          <video 
            className="video-player" 
            controls 
            autoPlay
            poster={video.coverImageFileUrl || undefined}
            preload="metadata"
            onClick={handleVideoClick}
            controlsList="nodownload"
          >
            <source src={video.fileUrl} type="video/mp4" />
            {t('videoNotSupported', language)}
          </video>
        ) : (
          <>
            {video.coverImageFileUrl && (
              <div className="video-card-image">
                <img src={video.coverImageFileUrl} alt={video.name} loading="lazy" />
                <button 
                  className="video-play-overlay"
                  onClick={handlePlayClick}
                  type="button"
                  aria-label={`${t('play', language)} ${video.name}`}
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="rgba(255, 255, 255, 0.9)" />
                    <path d="M10 8L16 12L10 16V8Z" fill="var(--primary-color)" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Content */}
      <div className="video-card-content">
        {/* Title */}
        <h3 className="video-card-title">{video.name}</h3>
        
        {/* Description */}
        {isExpandedView && video.description && (
          <p className="video-card-description">{video.description}</p>
        )}
      </div>
    </div>
  )
}
