'use client'

import { Link } from 'react-router'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { formatPrice } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useCart } from '../cart-context'

export function CartPage() {
  const { items, total, count, updateQuantity, removeFromCart } = useCart()

  return (
    <div className="mx-auto max-w-5xl px-4 pt-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Ваша корзина</h1>

      {items.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <ShoppingCart className="size-10 text-muted-foreground" aria-hidden="true" />
          <p className="text-lg font-medium">Корзина пуста</p>
          <p className="text-sm text-muted-foreground">Найдите свое следующее приключение в каталоге.</p>
          <Link to="/catalog" className={cn(buttonVariants({ size: 'lg' }), 'mt-2 px-5')}>
            Просмотреть каталог
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <ul className="flex flex-col gap-4 lg:col-span-2">
            {items.map(({ game, quantity }) => (
              <li key={game.id} className="flex gap-4 rounded-xl border border-border bg-card p-4">
                <img
                  src={game.cover || '/placeholder.svg'}
                  alt={`${game.title} cover art`}
                  className="h-28 w-20 shrink-0 rounded-md object-cover"
                />
                <div className="flex flex-1 flex-col justify-between gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-display font-semibold">{game.title}</h2>
                      <p className="text-sm text-highlight">{game.genre}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(game.id)}
                      aria-label={`Remove ${game.title} from cart`}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => updateQuantity(game.id, quantity - 1)}
                        aria-label={`Decrease quantity of ${game.title}`}
                      >
                        <Minus aria-hidden="true" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium" aria-live="polite">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => updateQuantity(game.id, quantity + 1)}
                        aria-label={`Increase quantity of ${game.title}`}
                      >
                        <Plus aria-hidden="true" />
                      </Button>
                    </div>
                    <p className="font-display font-bold">{formatPrice(game.price * quantity)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold">Ваш заказ</h2>
            <dl className="mt-4 flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{`Товары`}</dt>
                <dd>{count}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Доставка</dt>
                <dd className="text-highlight">Мгновенно · Бесплатно</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                <dt>Итого</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>
            <Link to="/checkout" className={cn(buttonVariants({ size: 'lg' }), 'mt-6 h-11 w-full text-base')}>
              Оформить заказ
            </Link>
          </aside>
        </div>
      )}
    </div>
  )
}
