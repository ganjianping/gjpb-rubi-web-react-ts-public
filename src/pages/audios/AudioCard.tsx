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
             <div className="icon-pause" />
          ) : (
             <div className="icon-play" />
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
