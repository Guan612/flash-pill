import { Link } from '@tanstack/react-router'
import { Pill } from 'lucide-react'
import BetterAuthHeader from '#/services/auth/better-auth-integration/header-user'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-3 text-base font-semibold text-foreground"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-indigo-500/18 via-white to-pink-500/20 text-indigo-600 shadow-sm dark:text-indigo-300">
              <Pill className="size-4.5" aria-hidden="true" />
            </span>
            <span className="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
              闪念胶囊
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <BetterAuthHeader />
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}
