import { useAppSettings } from '@/shared/contexts/AppSettingsContext'
import { t } from '@/shared/i18n'
import type { Audio } from '@/shared/data/types'
import './AudioCard.css'

interface AudioCardProps {
  readonly audio: Audio
  readonly onPlay: (audio: Audio) => void
  readonly isPlaying?: boolean
}

export default function AudioCard({ audio, onPlay, isPlaying = false }: AudioCardProps) {
  const { language } = useAppSettings()

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onPlay(audio)
  }

  return (
    <div className={`audio-card ${isPlaying ? 'playing' : ''}`}>
      <div className="audio-card-row">
        <button 
          className="audio-play-button"
          onClick={handlePlayClick}
          type="button"
          aria-label={`${t('play', language)} ${audio.name}`}
        >
          {isPlaying ? (
             // Playing icon (pause)
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <rect x="7" y="5" width="4" height="14" rx="2" fill="currentColor"/>
               <rect x="13" y="5" width="4" height="14" rx="2" fill="currentColor"/>
             </svg>
          ) : (
            // Play icon
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M8 6L18 12L8 18V6Z" 
                fill="currentColor" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinejoin="round" 
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        <div className="audio-card-info">
          <h3 className="audio-card-title">
            {audio.artist ? `${audio.artist} - ${audio.name}` : audio.name}
          </h3>
        </div>
      </div>
    </div>
  )
}
