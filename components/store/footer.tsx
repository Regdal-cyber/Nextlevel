import { Link } from 'react-router'
import { Gamepad2 } from 'lucide-react'

const columns = [
  {
    title: 'Магазин',
    links: [
      { label: 'Главная', to: '/' },
      { label: 'Каталог', to: '/catalog' },
      { label: 'Корзина', to: '/cart' },
    ],
  },
  {
    title: 'Поддержка',
    links: [
      { label: 'Центр поддержки', to: '/' },
      { label: 'Политика возврата', to: '/' },
      { label: 'Контакты', to: '/' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <Gamepad2 className="size-6 text-primary" aria-hidden="true" />
            <span>
              Next<span className="text-highlight">Level</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Твоё место для самых горячих новинок и любимой классики. Мгновенная доставка,
            честные цены и каталог, собранный геймерами для геймеров.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider">
              {column.title}
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-highlight"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          {`© ${new Date().getFullYear()} NextLevel. Все права защищены.`}
        </p>
      </div>
    </footer>
  )
}
