import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/auth/login')({
  component: AuthLoginPage,
})

type AuthMode = 'sign-in' | 'sign-up'

function AuthLoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const title = mode === 'sign-in' ? '登录' : '注册'

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      setErrorMessage('请填写邮箱和密码')
      return
    }

    if (mode === 'sign-up' && !name.trim()) {
      setErrorMessage('注册时需要填写昵称')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      if (mode === 'sign-in') {
        const result = await authClient.signIn.email({
          email,
          password,
        })

        if (result?.error) {
          setErrorMessage(result.error.message || '登录失败，请稍后重试')
          return
        }
      } else {
        const result = await authClient.signUp.email({
          name,
          email,
          password,
        })

        if (result?.error) {
          setErrorMessage(result.error.message || '注册失败，请稍后重试')
          return
        }
      }

      await navigate({ to: '/' })
    } catch (error) {
      console.error(error)
      setErrorMessage(
        mode === 'sign-in' ? '登录失败，请稍后重试' : '注册失败，请稍后重试',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-wrap px-4 py-10 sm:py-14">
      <section className="island-shell mx-auto w-full max-w-md rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Auth</p>
        <h1 className="display-title mb-2 text-3xl font-bold text-[var(--sea-ink)]">
          欢迎回来
        </h1>
        <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">
          使用邮箱密码登录，或直接创建新账号。
        </p>

        <div className="mb-5 grid grid-cols-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-1">
          <button
            type="button"
            onClick={() => {
              setMode('sign-in')
              setErrorMessage('')
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === 'sign-in'
                ? 'bg-[var(--surface-strong)] text-[var(--sea-ink)] shadow-sm'
                : 'text-[var(--sea-ink-soft)] hover:bg-white/50'
            }`}
          >
            登录
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('sign-up')
              setErrorMessage('')
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === 'sign-up'
                ? 'bg-[var(--surface-strong)] text-[var(--sea-ink)] shadow-sm'
                : 'text-[var(--sea-ink-soft)] hover:bg-white/50'
            }`}
          >
            注册
          </button>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          {mode === 'sign-up' ? (
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-[var(--sea-ink)]">
                昵称
              </span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="你的昵称"
                autoComplete="name"
                className="h-10 w-full rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-sm text-[var(--sea-ink)] outline-none ring-0 transition focus:border-[var(--lagoon-deep)]"
              />
            </label>
          ) : null}

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[var(--sea-ink)]">
              邮箱
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="h-10 w-full rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-sm text-[var(--sea-ink)] outline-none ring-0 transition focus:border-[var(--lagoon-deep)]"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[var(--sea-ink)]">
              密码
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="至少 8 位"
              autoComplete={
                mode === 'sign-in' ? 'current-password' : 'new-password'
              }
              className="h-10 w-full rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-sm text-[var(--sea-ink)] outline-none ring-0 transition focus:border-[var(--lagoon-deep)]"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-lg border border-red-300/60 bg-red-50/80 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? `${title}中...` : title}
          </Button>
        </form>
      </section>
    </main>
  )
}
