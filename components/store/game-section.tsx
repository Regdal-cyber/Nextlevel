import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import type { Game } from '@/lib/api'
import { GameCard } from './game-card'

type GameSectionProps = {
  id: string
  eyebrow: string
  title: string
  games: Game[]
}

export function GameSection({ id, eyebrow, title, games }: GameSectionProps) {
  return (
    <section aria-labelledby={id} className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-highlight">{eyebrow}</p>
          <h2 id={id} className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
        </div>
        <Link
          to="/catalog"
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-highlight"
        >
          Все товары
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  )
}
