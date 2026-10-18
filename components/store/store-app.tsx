'use client'

import { useEffect } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router'
import { CartProvider } from './cart-context'
import { Footer } from './footer'
import { Navbar } from './navbar'
import { CartPage } from './pages/cart-page'
import { CatalogPage } from './pages/catalog-page'
import { HomePage } from './pages/home-page'
import { GamePage } from './pages/game-page'
import { CheckoutPage } from './pages/checkout-page'
import { OrderSuccessPage } from './pages/order-success-page'
import { AdminPage } from './pages/admin-page'
import { AdminGameForm } from './pages/admin-game-form'
import { AuthProvider } from './auth-context'
import { LoginPage } from './pages/login-page'
import { RegisterPage } from './pages/register-page'
import { AdminOrdersPage } from './pages/admin-orders-page'


function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 pt-24 text-center">
      <p className="font-display text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold">Страница не найдена</h1>
      <Link to="/" className="mt-6 text-highlight hover:underline">
        Вернуться на главную
      </Link>
    </div>
  )
}

export default function StoreApp() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <div className="flex min-h-svh flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/game/:id" element={<GamePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/orders" element={<AdminOrdersPage />} />
                <Route path="/admin/games/new" element={<AdminGameForm />} />
                <Route path="/admin/games/edit/:id" element={<AdminGameForm />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
