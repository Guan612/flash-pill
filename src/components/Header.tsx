import { Link } from '@tanstack/react-router'
import BetterAuthHeader from '#/services/auth/better-auth-integration/header-user'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-glass backdrop-blur-lg border-b border-border">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent"
          >
            <span className="text-2xl">💊</span>
            闪念胶囊
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
