'use client'

import { Link, useSearchParams } from 'react-router'
import { CheckCircle } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function OrderSuccessPage() {
    const [searchParams] = useSearchParams()
    const orderId = searchParams.get('id')

    return (
        <div className="mx-auto flex max-w-xl flex-col items-center px-4 pt-24 text-center">
            <CheckCircle className="size-16 text-green-400" aria-hidden="true" />
            <h1 className="mt-6 font-display text-3xl font-bold">Заказ оформлен!</h1>
            <p className="mt-2 text-muted-foreground">
                Спасибо за покупку. Мы отправили детали заказа на ваш email.
            </p>
            {orderId && (
                <p className="mt-4 text-sm text-muted-foreground">
                    Номер заказа: <span className="font-mono font-bold text-foreground">#{orderId}</span>
                </p>
            )}
            <Link to="/catalog" className={cn(buttonVariants({ size: 'lg' }), 'mt-8')}>
                Вернуться в каталог
            </Link>
        </div>
    )
}