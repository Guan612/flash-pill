import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('auth login routing', () => {
  it('defines /auth/login route file', () => {
    const routeFile = resolve(process.cwd(), 'src/routes/auth/login.tsx')
    const source = readFileSync(routeFile, 'utf8')

    expect(source).toContain("createFileRoute('/auth/login')")
    expect(source).toContain('登录')
    expect(source).toContain('注册')
  })

  it('uses /auth/login for the Sign in link', () => {
    const headerUserFile = resolve(
      process.cwd(),
      'src/integrations/better-auth/header-user.tsx',
    )
    const source = readFileSync(headerUserFile, 'utf8')

    expect(source).toContain('to="/auth/login"')
  })
})
