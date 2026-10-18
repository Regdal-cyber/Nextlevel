'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchGames, type Game } from '@/lib/api'
import { GameCard } from '../game-card'

const ALL = 'Все'

export function CatalogPage() {
  const [games, setGames] = useState<Game[]>([])
  const [genre, setGenre] = useState(ALL)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGames()
      .then(setGames)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const genres = Array.from(new Set(games.map(g => g.genre))).sort()

  const normalizedQuery = query.trim().toLowerCase()
  const filtered = games.filter(
    (game) =>
      (genre === ALL || game.genre === genre) &&
      (normalizedQuery === '' || game.title.toLowerCase().includes(normalizedQuery)),
  )

  if (loading) return <p className="pt-24 text-center">Загрузка...</p>

  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-highlight">Библеотека игр</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">Каталог</h1>
          <p className="mt-2 text-muted-foreground">{`${filtered.length} из ${games.length} игр`}</p>
        </div>
        <div className="relative w-full md:w-72">
          <label htmlFor="catalog-search" className="sr-only">
            Search games
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="catalog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск игр..."
            className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
          />
        </div>
      </header>

      <div role="group" aria-label="Filter by genre" className="mt-8 flex flex-wrap gap-2">
        {[ALL, ...genres].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setGenre(option)}
            aria-pressed={genre === option}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              genre === option
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-highlight/60 hover:text-foreground',
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted-foreground">No games match your filters.</p>
      )}
    </div>
  )
}
