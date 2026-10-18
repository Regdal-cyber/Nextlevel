import { Star } from 'lucide-react'

export function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center" role="img" aria-label={`Rated ${rating} out of 5`}>
        {Array.from({ length: 5 }, (_, index) => {
          const fill = Math.min(Math.max(rating - index, 0), 1)
          return (
            <span key={index} className="relative size-3.5" aria-hidden="true">
              <Star className="absolute inset-0 size-3.5 text-muted-foreground/40" />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
              </span>
            </span>
          )
        })}
      </div>
      <span className="text-xs font-medium text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  )
}
