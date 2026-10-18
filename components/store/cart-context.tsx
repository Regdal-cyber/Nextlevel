'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import type { Game } from '@/lib/api'

type CartItem = { game: Game; quantity: number }

type CartContextValue = {
  items: CartItem[]
  count: number
  total: number
  addToCart: (game: Game) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  isInCart: (id: number) => boolean
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const value = useMemo<CartContextValue>(() => {
    const addToCart = (game: Game) =>
      setItems((current) => {
        const existing = current.find((item) => item.game.id === game.id)
        if (existing) {
          return current.map((item) =>
            item.game.id === game.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        }
        return [...current, { game, quantity: 1 }]
      })

    const removeFromCart = (id: number) =>
      setItems((current) => current.filter((item) => item.game.id !== id))

    const updateQuantity = (id: number, quantity: number) =>
      setItems((current) =>
        quantity <= 0
          ? current.filter((item) => item.game.id !== id)
          : current.map((item) => (item.game.id === id ? { ...item, quantity } : item)),
      )

    return {
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      total: items.reduce((sum, item) => sum + item.quantity * item.game.price, 0),
      addToCart,
      removeFromCart,
      updateQuantity,
      isInCart: (id) => items.some((item) => item.game.id === id),
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}