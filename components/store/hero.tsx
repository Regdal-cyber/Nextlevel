import { Link } from 'react-router'
import { ArrowRight, Sparkles } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <img
        src="/images/Ghostrunner.jpg"
        alt=""
        className="absolute inset-0 -z-20 size-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/80 to-background/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 md:min-h-[640px] lg:px-8">
        <p className="flex w-fit items-center gap-2 rounded-full border border-highlight/40 bg-highlight/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-highlight">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Рекомендуем: Ghostrunner
        </p>
        <h1
          id="hero-title"
          className="mt-6 font-display text-6xl font-bold tracking-tighter sm:text-7xl lg:text-8xl"
        >
          Next
          <span className="bg-gradient-to-r from-primary to-highlight bg-clip-text text-transparent">
            Level
          </span>
        </h1>
        <p className="mt-4 font-display text-2xl font-medium text-foreground/90 sm:text-3xl">
          Level Up Your Gaming
        </p>
        <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
          Блокбастеры, инди-жемчужины и последние новинки — всё в одном месте. Мгновенная доставка каждой игры прямо в твою библиотеку.
        </p>
        <div className="mt-8">
          <Link
            to="/catalog"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'h-12 gap-2 px-6 text-base shadow-[0_0_32px_-4px] shadow-primary/80 hover:bg-primary/85',
            )}
          >
            Просмотреть каталог
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
