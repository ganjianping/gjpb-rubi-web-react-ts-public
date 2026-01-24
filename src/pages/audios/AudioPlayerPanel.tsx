import { useState, useRef, useEffect } from 'react'
import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { Audio } from '@/shared/data/types'
import './AudioPlayerPanel.css'

interface AudioPlayerPanelProps {
  readonly audio: Audio
  readonly onClose: () => void
}

export default function AudioPlayerPanel({ audio, onClose }: AudioPlayerPanelProps) {
  const { language } = useAppSettings()
  const [showSubtitle, setShowSubtitle] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Auto play when audio changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load()
      audioRef.current.play().catch(err => console.error('Auto-play failed:', err))
    }
  }, [audio.id])

  return (
    <div className="audio-player-panel">
      <div className="audio-player-content">
        {/* Subtitle Section */}
        {showSubtitle && audio.subtitle && (
          <div className="audio-subtitle-container">
             <div dangerouslySetInnerHTML={{ __html: audio.subtitle }} />
          </div>
        )}

        {/* Main Player Controls */}
        <div className="audio-player-main">
          {/* Info */}
          <div className="audio-info-display">
            <div className="audio-title-display">{audio.name}</div>
            {audio.artist && (
              <div className="audio-artist-display">{audio.artist}</div>
            )}
          </div>

          {/* Audio Element */}
          <div className="audio-element-wrapper">
            <audio 
              ref={audioRef}
              controls 
              controlsList="nodownload"
              className="audio-player-element"
            >
              <source src={audio.fileUrl} type="audio/mpeg" />
              {t('audioNotSupported', language)}
            </audio>
          </div>

          {/* Extra Controls */}
          <div className="audio-controls-extra">
            {/* Subtitle Toggle */}
            {audio.subtitle && (
              <button 
                className={`subtitle-toggle-btn ${showSubtitle ? 'active' : ''}`}
                onClick={() => setShowSubtitle(!showSubtitle)}
                title={showSubtitle ? t('hideSubtitle', language) : t('showSubtitle', language)}
                aria-label={showSubtitle ? t('hideSubtitle', language) : t('showSubtitle', language)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20V18H4V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 14H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}

            {/* Close Button */}
            <button 
              className="close-player-btn"
              onClick={onClose}
              title={t('close', language)}
              aria-label={t('close', language)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
