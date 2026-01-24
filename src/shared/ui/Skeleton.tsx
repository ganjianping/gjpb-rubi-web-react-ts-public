import './Skeleton.css'

interface SkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
  className?: string
}

export function Skeleton({ width = '100%', height = '20px', borderRadius = '4px', className = '' }: SkeletonProps) {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  )
}

interface SkeletonCardProps {
  type?: 'vocabulary' | 'expression' | 'sentence'
}

export function SkeletonCard({ type = 'vocabulary' }: SkeletonCardProps) {
  return (
    <div className={`skeleton-card ${type}`}>
      {/* Audio button placeholder */}
      <div className="skeleton-audio">
        <Skeleton width="28px" height="28px" borderRadius="50%" />
      </div>
      
      {/* Main content */}
      <div className="skeleton-content">
        {/* Title/Name */}
        <Skeleton height="24px" borderRadius="6px" />
        
        {/* Phonetic */}
        <Skeleton width="60%" height="18px" borderRadius="4px" />
        
        {/* Additional info based on type */}
        {type === 'vocabulary' && (
          <Skeleton width="80%" height="16px" borderRadius="4px" />
        )}
      </div>
    </div>
  )
}

interface SkeletonGridProps {
  count?: number
  type?: 'vocabulary' | 'expression' | 'sentence'
}

export function SkeletonGrid({ count = 20, type = 'vocabulary' }: SkeletonGridProps) {
  const getGridClassName = () => {
    if (type === 'vocabulary') return 'vocabularies-grid'
    if (type === 'expression') return 'expressions-grid'
    return 'sentences-grid'
  }

  return (
    <div className={getGridClassName()}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={`skeleton-${index}`} type={type} />
      ))}
    </div>
  )
}

export function SkeletonDetail() {
  return (
    <div className="skeleton-detail">
      <div className="skeleton-detail-actions">
        <Skeleton width="100px" height="44px" borderRadius="8px" />
        <Skeleton width="100px" height="44px" borderRadius="8px" />
      </div>
      
      <div className="skeleton-detail-container">
        {/* Cover Image */}
        <Skeleton height="400px" borderRadius="0" />
        
        {/* Content */}
        <div className="skeleton-detail-content">
          {/* Title */}
          <Skeleton height="48px" borderRadius="8px" />
          
          {/* Summary */}
          <div style={{ marginTop: '2rem' }}>
            <Skeleton height="80px" borderRadius="12px" />
          </div>
          
          {/* Meta tags */}
          <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem' }}>
            <Skeleton width="80px" height="32px" borderRadius="6px" />
            <Skeleton width="100px" height="32px" borderRadius="6px" />
            <Skeleton width="90px" height="32px" borderRadius="6px" />
          </div>
          
          {/* Content paragraphs */}
          <div style={{ marginTop: '3rem' }}>
            <Skeleton height="24px" borderRadius="4px" />
            <div style={{ marginTop: '1rem' }}>
              <Skeleton height="20px" borderRadius="4px" />
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <Skeleton height="20px" borderRadius="4px" />
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <Skeleton width="60%" height="20px" borderRadius="4px" />
            </div>
            
            <div style={{ marginTop: '2rem' }}>
              <Skeleton height="20px" borderRadius="4px" />
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <Skeleton height="20px" borderRadius="4px" />
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <Skeleton width="80%" height="20px" borderRadius="4px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
