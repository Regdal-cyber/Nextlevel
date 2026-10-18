'use client'

import { Check, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice, type Game } from '@/lib/api'
import { useCart } from './cart-context'
import { RatingStars } from './rating-stars'
import { Link } from 'react-router'
import { cn } from '@/lib/utils'

export function GameCard({ game }: { game: Game }) {
  const { addToCart, isInCart } = useCart()
  const inCart = isInCart(game.id)

  return (
    <Link to={`/game/${game.id}`}>
      <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_0_32px_-8px] hover:shadow-primary/60">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={game.cover || '/placeholder.svg'}
            alt={`${game.title} cover art`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-md bg-background/80 px-2 py-1 text-xs font-medium text-highlight backdrop-blur-sm">
            {game.genre}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex flex-col gap-1.5">
            <h3 className="font-display text-lg font-semibold leading-tight text-balance">{game.title}</h3>
            <p className="sr-only">Genre: {game.genre}</p>
            <RatingStars rating={game.rating} />
          </div>
          <div className="flex items-center gap-2 text-xs">
            {game.inStock ? (
              <span className="text-green-400">В продаже</span>
            ) : (
              <span className="text-red-400">Нет в наличии</span>
            )}
          </div>
          <div className="mt-auto flex items-center justify-between gap-3">
            <p className="font-display text-xl font-bold">{formatPrice(game.price)}</p>
            <Button
              size="lg"
              onClick={(e) => {
                e.preventDefault()
                addToCart(game)
              }}
              disabled={!game.inStock}
              className={cn(
                inCart
                  ? 'bg-highlight px-3 text-highlight-foreground hover:bg-highlight/90'
                  : 'px-3 hover:bg-primary/85 hover:shadow-[0_0_16px_-2px] hover:shadow-primary',
                !game.inStock && 'opacity-50 cursor-not-allowed hover:bg-primary hover:shadow-none'
              )}
            >
              {game.inStock ? (
                <>
                  {inCart ? <Check /> : <ShoppingCart />}
                  {inCart ? 'Добавлен' : 'Добавить'}
                </>
              ) : (
                'Нет в наличии'
              )}
            </Button>
          </div>
        </div>
      </article>
    </Link>
  )
}
