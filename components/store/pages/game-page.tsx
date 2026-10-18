'use client'

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, Check, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchGame, formatPrice, type Game } from '@/lib/api'
import { useCart } from '../cart-context'
import { RatingStars } from '../rating-stars'

export function GamePage() {
    const { id } = useParams()
    const [game, setGame] = useState<Game | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const { addToCart, isInCart } = useCart()

    useEffect(() => {
        if (!id) return

        fetchGame(Number(id))
            .then(setGame)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return <p className="pt-24 text-center text-muted-foreground">Загрузка...</p>
    }

    if (error || !game) {
        return (
            <div className="mx-auto max-w-xl px-4 pt-24 text-center">
                <p className="text-6xl font-bold text-primary">404</p>
                <h1 className="mt-4 text-2xl font-semibold">Игра не найдена</h1>
                <Link to="/catalog" className="mt-6 inline-block text-highlight hover:underline">
                    Вернуться в каталог
                </Link>
            </div>
        )
    }

    const inCart = isInCart(game.id)

    return (
        <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
            <Link
                to="/catalog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Назад в каталог
            </Link>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
                {/* Обложка */}
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <img
                        src={game.cover || '/placeholder.svg'}
                        alt={`${game.title} cover art`}
                        className="w-full object-cover"
                    />
                </div>

                {/* Информация */}
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <h1 className="font-display text-4xl font-bold tracking-tight">{game.title}</h1>
                        <RatingStars rating={game.rating} />
                    </div>

                    {/* Жанр и платформа */}
                    <div className="flex flex-wrap gap-2">
                        <span className="rounded-md bg-secondary px-3 py-1 text-sm font-medium">
                            {game.genre}
                        </span>
                        <span className="rounded-md bg-secondary px-3 py-1 text-sm font-medium">
                            {game.platform}
                        </span>
                    </div>

                    {/* Описание */}
                    <p className="text-muted-foreground leading-relaxed">{game.description}</p>

                    {/* Дата выхода и наличие */}
                    <div className="flex flex-col gap-2 text-sm">
                        <p className="text-muted-foreground">
                            Дата выхода:{' '}
                            <span className="text-foreground">
                                {new Date(game.releaseDate).toLocaleDateString('ru-RU', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </span>
                        </p>
                        <p>
                            {game.inStock ? (
                                <span className="text-green-400">В продаже</span>
                            ) : (
                                <span className="text-red-400">Нет в наличии</span>
                            )}
                        </p>
                    </div>

                    {/* Цена и кнопка */}
                    <div className="mt-2 flex items-center justify-between gap-4 border-t border-border pt-5">
                        <p className="font-display text-3xl font-bold">{formatPrice(game.price)}</p>
                        <Button
                            size="lg"
                            onClick={() => addToCart(game)}
                            disabled={!game.inStock}
                            className="h-12 px-6 text-base"
                        >
                            {inCart ? <Check aria-hidden="true" /> : <ShoppingCart aria-hidden="true" />}
                            {inCart ? 'В корзине' : 'В корзину'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}