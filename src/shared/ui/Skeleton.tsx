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
