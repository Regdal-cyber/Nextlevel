'use client'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { useAuth } from '../auth-context'

export function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await login(form.email, form.password)
            navigate('/')
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка входа')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mx-auto max-w-md px-4 pt-24">
            <h1 className="font-display text-3xl font-bold">Вход</h1>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                <div>
                    <label className="mb-1 block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        className="w-full rounded-lg border border-input bg-card px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Пароль</label>
                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                        className="w-full rounded-lg border border-input bg-card px-3 py-2"
                    />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <Button type="submit" size="lg" disabled={loading}>
                    {loading ? 'Вход...' : 'Войти'}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Нет аккаунта?{' '}
                    <Link to="/register" className="text-highlight hover:underline">
                        Зарегистрироваться
                    </Link>
                </p>
            </form>
        </div>
    )
}