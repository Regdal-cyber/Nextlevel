'use client'

import { useEffect, useState } from 'react'
import { fetchGames, type Game } from '@/lib/api'
import { GameSection } from '../game-section'
import { Hero } from '../hero'

export function HomePage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGames()
      .then(setGames)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="pt-24 text-center">Загрузка...</p>

  const popularGames = games.filter(g => g.popular).slice(0, 4)
  const newReleases = [...games]
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
    .slice(0, 4)

  return (
    <>
      <Hero />
      <GameSection id="popular-games" eyebrow="В тренде" title="Популярные игры" games={popularGames} />
      <GameSection id="new-releases" eyebrow="Только вышли" title="Новые релизы" games={newReleases} />
    </>
  )
}