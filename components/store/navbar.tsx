'use client'

import { Link, NavLink } from 'react-router'
import { Gamepad2, LogOut, ShoppingCart, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from './cart-context'
import { useAuth } from './auth-context'

const links = [
  { to: '/', label: 'Главная', end: true },
  { to: '/catalog', label: 'Каталог', end: false },
]

export function Navbar() {
  const { count } = useCart()
  const { user, logout, isAdmin } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        {/* Левая часть: Логотип */}
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary shadow-[0_0_20px_-2px] shadow-primary/70">
            <Gamepad2 className="size-5 text-primary-foreground" aria-hidden="true" />
          </span>
          <span>
            Next<span className="text-highlight">Level</span>
          </span>
        </Link>

        {/* Правая часть: Навигация + Пользователь */}
        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="flex items-center gap-1 sm:gap-2">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive ? 'text-highlight' : 'text-muted-foreground hover:text-foreground',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            {/* Корзина */}
            <li>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  cn(
                    'relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'text-highlight' : 'text-muted-foreground hover:text-foreground',
                  )
                }
              >
                <ShoppingCart className="size-4" aria-hidden="true" />
                <span>Корзина</span>
                {count > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                    {count}
                    <span className="sr-only"> товары в корзине</span>
                  </span>
                )}
              </NavLink>
            </li>

            {/* Админ (только для админа) */}
            {isAdmin && (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    cn(
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive ? 'text-highlight' : 'text-muted-foreground hover:text-foreground',
                    )
                  }
                >
                  Админ
                </NavLink>
              </li>
            )}
          </ul>

          {/* Разделитель */}
          <div className="mx-2 h-6 w-px bg-border" aria-hidden="true" />

          {/* Пользователь */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
                <User className="size-4" aria-hidden="true" />
                {user.name}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'text-highlight' : 'text-muted-foreground hover:text-foreground',
                )
              }
            >
              Войти
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  )
}