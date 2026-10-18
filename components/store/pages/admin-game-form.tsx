'use client'

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { fetchGame, createGame, updateGame } from '@/lib/api'

interface FormData {
    title: string
    description: string
    genre: string
    platform: string
    price: number
    rating: number
    cover: string
    release_date: string
    popular: boolean
    in_stock: boolean
}

const EMPTY_FORM: FormData = {
    title: '',
    description: '',
    genre: '',
    platform: '',
    price: 0,
    rating: 0,
    cover: '',
    release_date: '',
    popular: false,
    in_stock: true,
}

export function AdminGameForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEdit = Boolean(id)

    const [form, setForm] = useState<FormData>(EMPTY_FORM)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (isEdit && id) {
            fetchGame(Number(id))
                .then((game) => {
                    setForm({
                        title: game.title,
                        description: game.description,
                        genre: game.genre,
                        platform: game.platform,
                        price: game.price,
                        rating: game.rating,
                        cover: game.cover,
                        release_date: game.releaseDate.split('T')[0],
                        popular: game.popular,
                        in_stock: game.inStock,
                    })
                })
                .catch((err) => setError(err.message))
        }
    }, [id, isEdit])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target
        setForm({
            ...form,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!form.title || !form.price) {
            setError('Название и цена обязательны')
            return
        }

        setLoading(true)
        setError('')

        try {
            const data = {
                ...form,
                price: Number(form.price),
                rating: Number(form.rating),
            }

            if (isEdit && id) {
                await updateGame(Number(id), data)
            } else {
                await createGame(data)
            }

            navigate('/admin')
        } catch (err: any) {
            setError(err.response?.data?.error || err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6 lg:px-8">
            <h1 className="font-display text-4xl font-bold">
                {isEdit ? 'Редактировать игру' : 'Добавить игру'}
            </h1>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                <div>
                    <label className="mb-1 block text-sm font-medium">Название *</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-input bg-card px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Описание</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full rounded-lg border border-input bg-card px-3 py-2"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Жанр</label>
                        <input
                            name="genre"
                            value={form.genre}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-input bg-card px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Платформа</label>
                        <input
                            name="platform"
                            value={form.platform}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-input bg-card px-3 py-2"
                        />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Цена *</label>
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            value={form.price}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-input bg-card px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Рейтинг</label>
                        <input
                            name="rating"
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={form.rating}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-input bg-card px-3 py-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Путь к обложке</label>
                    <input
                        name="cover"
                        value={form.cover}
                        onChange={handleChange}
                        placeholder="/images/games/example.jpg"
                        className="w-full rounded-lg border border-input bg-card px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Дата выхода</label>
                    <input
                        name="release_date"
                        type="date"
                        value={form.release_date}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-input bg-card px-3 py-2"
                    />
                </div>

                <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                        <input
                            name="popular"
                            type="checkbox"
                            checked={form.popular}
                            onChange={handleChange}
                        />
                        <span className="text-sm">Популярная</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            name="in_stock"
                            type="checkbox"
                            checked={form.in_stock}
                            onChange={handleChange}
                        />
                        <span className="text-sm">В наличии</span>
                    </label>
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <div className="flex gap-3">
                    <Button type="submit" size="lg" disabled={loading}>
                        {loading ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Добавить'}
                    </Button>
                    <Button type="button" variant="outline" size="lg" onClick={() => navigate('/admin')}>
                        Отмена
                    </Button>
                </div>
            </form>
        </div>
    )
}