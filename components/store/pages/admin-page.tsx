'use client'

import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchGames, deleteGame, formatPrice, type Game } from '@/lib/api'
import { useAuth } from '../auth-context'

export function AdminPage() {
    const { user, isAdmin, loading: authLoading } = useAuth()
    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadGames = async () => {
        try {
            setLoading(true)
            const data = await fetchGames()
            setGames(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isAdmin) {
            loadGames()
        }
    }, [isAdmin])

    const handleDelete = async (id: number, title: string) => {
        if (!window.confirm(`Удалить игру "${title}"?`)) return

        try {
            await deleteGame(id)
            loadGames()
        } catch (err: any) {
            alert('Ошибка удаления: ' + err.message)
        }
    }

    // Проверки доступа
    if (authLoading) return <p>Загрузка...</p>

    if (!user) {
        return (
            <div className="mx-auto max-w-xl px-4 pt-24 text-center">
                <h1 className="font-display text-3xl font-bold">Требуется вход</h1>
                <p className="mt-4 text-muted-foreground">Войдите, чтобы получить доступ к админке.</p>
                <Link to="/login" className="mt-6 inline-block text-highlight hover:underline">
                    Войти
                </Link>
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <div className="mx-auto max-w-xl px-4 pt-24 text-center">
                <h1 className="font-display text-3xl font-bold">Доступ запрещён</h1>
                <p className="mt-4 text-muted-foreground">У вас нет прав администратора.</p>
                <Link to="/" className="mt-6 inline-block text-highlight hover:underline">
                    На главную
                </Link>
            </div>
        )
    }

    if (loading) {
        return <p className="pt-24 text-center">Загрузка игр...</p>
    }

    if (error) {
        return <p className="pt-24 text-center text-red-400">Ошибка: {error}</p>
    }

    return (
        <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-highlight">Admin Panel</p>
                    <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">Управление играми</h1>
                </div>
                <Link to="/admin/orders">
                    <Button variant="outline" size="lg">
                        Заказы
                    </Button>
                </Link>
                <Link to="/admin/games/new">
                    <Button size="lg">
                        <Plus className="size-4" />
                        Добавить игру
                    </Button>
                </Link>
            </div>

            <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
                <table className="w-full">
                    <thead className="bg-secondary/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Название</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Жанр</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Цена</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">В наличии</th>
                            <th className="px-4 py-3 text-right text-sm font-medium">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map((game) => (
                            <tr key={game.id} className="border-t border-border">
                                <td className="px-4 py-3 text-sm">{game.id}</td>
                                <td className="px-4 py-3 text-sm font-medium">{game.title}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">{game.genre}</td>
                                <td className="px-4 py-3 text-sm">{formatPrice(game.price)}</td>
                                <td className="px-4 py-3 text-sm">
                                    {game.inStock ? (
                                        <span className="text-green-400">✅ Да</span>
                                    ) : (
                                        <span className="text-red-400">❌ Нет</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link to={`/admin/games/edit/${game.id}`}>
                                            <Button variant="outline" size="icon-sm" aria-label="Редактировать">
                                                <Pencil className="size-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="icon-sm"
                                            onClick={() => handleDelete(game.id, game.title)}
                                            aria-label="Удалить"
                                        >
                                            <Trash2 className="size-4 text-red-400" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}