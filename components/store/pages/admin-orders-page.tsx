'use client'

import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    fetchOrders,
    updateOrderStatus,
    formatPrice,
    formatDate,
    ORDER_STATUSES,
    type Order,
} from '@/lib/api'
import { useAuth } from '../auth-context'

export function AdminOrdersPage() {
    const { user, isAdmin, loading: authLoading } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadOrders = async () => {
        try {
            setLoading(true)
            const data = await fetchOrders()
            setOrders(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isAdmin) {
            loadOrders()
        }
    }, [isAdmin])

    const handleStatusChange = async (id: number, status: string) => {
        try {
            await updateOrderStatus(id, status)
            loadOrders()
        } catch (err: any) {
            alert('Ошибка: ' + err.message)
        }
    }

    const getStatusLabel = (status: string) => {
        return ORDER_STATUSES.find((s) => s.value === status)?.label || status
    }

    const getStatusColor = (status: string) => {
        return ORDER_STATUSES.find((s) => s.value === status)?.color || 'text-muted-foreground'
    }

    // Проверки доступа
    if (authLoading) return <p className="pt-24 text-center">Загрузка...</p>

    if (!user) {
        return (
            <div className="mx-auto max-w-xl px-4 pt-24 text-center">
                <h1 className="font-display text-3xl font-bold">Требуется вход</h1>
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
                <Link to="/" className="mt-6 inline-block text-highlight hover:underline">
                    На главную
                </Link>
            </div>
        )
    }

    if (loading) return <p className="pt-24 text-center">Загрузка заказов...</p>
    if (error) return <p className="pt-24 text-center text-red-400">Ошибка: {error}</p>

    return (
        <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
            <Link
                to="/admin"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Назад в админку
            </Link>

            <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-highlight">Admin Panel</p>
                <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">Заказы</h1>
                <p className="mt-2 text-muted-foreground">Всего заказов: {orders.length}</p>
            </div>

            {orders.length === 0 ? (
                <p className="mt-16 text-center text-muted-foreground">Заказов пока нет.</p>
            ) : (
                <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
                    <table className="w-full">
                        <thead className="bg-secondary/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Клиент</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Товары</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Сумма</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Дата</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-t border-border">
                                    <td className="px-4 py-3 text-sm font-mono">#{order.id}</td>
                                    <td className="px-4 py-3 text-sm font-medium">{order.customer_name}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{order.customer_email}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {order.items?.length || 0} шт.
                                    </td>
                                    <td className="px-4 py-3 text-sm font-semibold">{formatPrice(order.total)}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {formatDate(order.created_at)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`rounded-md border border-input bg-card px-2 py-1 text-sm font-medium ${getStatusColor(order.status)}`}
                                        >
                                            {ORDER_STATUSES.map((s) => (
                                                <option key={s.value} value={s.value}>
                                                    {s.label}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}