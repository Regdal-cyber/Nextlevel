'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { createOrder, formatPrice } from '@/lib/api'
import { useCart } from '../cart-context'

export function CheckoutPage() {
    const { items, total, count } = useCart()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        customer_name: '',
        customer_email: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!form.customer_name || !form.customer_email) {
            setError('Имя и email обязательны')
            return
        }

        if (items.length === 0) {
            setError('Корзина пуста')
            return
        }

        setLoading(true)
        setError('')

        try {
            const order = await createOrder({
                customer_name: form.customer_name,
                customer_email: form.customer_email,
                items: items.map((item) => ({
                    game_id: item.game.id,
                    quantity: item.quantity,
                })),
            })

            navigate(`/order-success?id=${order.id}`)
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка оформления заказа')
        } finally {
            setLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="mx-auto max-w-xl px-4 pt-24 text-center">
                <h1 className="font-display text-3xl font-bold">Корзина пуста</h1>
                <p className="mt-4 text-muted-foreground">Добавьте игры перед оформлением заказа.</p>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-5xl px-4 pt-12 sm:px-6 lg:px-8">
            <h1 className="font-display text-4xl font-bold tracking-tight">Оформление заказа</h1>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
                <div className="flex flex-col gap-4 lg:col-span-2">
                    <div>
                        <label htmlFor="customer_name" className="mb-1 block text-sm font-medium">
                            Имя *
                        </label>
                        <input
                            id="customer_name"
                            name="customer_name"
                            type="text"
                            value={form.customer_name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
                        />
                    </div>

                    <div>
                        <label htmlFor="customer_email" className="mb-1 block text-sm font-medium">
                            Email *
                        </label>
                        <input
                            id="customer_email"
                            name="customer_email"
                            type="email"
                            value={form.customer_email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/30"
                        />
                    </div>

                    {error && <p className="text-sm text-red-400">{error}</p>}
                </div>

                <aside className="h-fit rounded-xl border border-border bg-card p-6">
                    <h2 className="font-display text-lg font-semibold">Ваш заказ</h2>
                    <ul className="mt-4 flex flex-col gap-2 text-sm">
                        {items.map((item) => (
                            <li key={item.game.id} className="flex justify-between">
                                <span className="text-muted-foreground">
                                    {item.game.title} × {item.quantity}
                                </span>
                                <span>{formatPrice(item.game.price * item.quantity)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex justify-between border-t border-border pt-3 text-base font-semibold">
                        <span>Итого ({count})</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    <Button
                        type="submit"
                        size="lg"
                        disabled={loading}
                        className="mt-6 h-11 w-full text-base"
                    >
                        {loading ? 'Оформление...' : 'Подтвердить заказ'}
                    </Button>
                </aside>
            </form>
        </div>
    )
}