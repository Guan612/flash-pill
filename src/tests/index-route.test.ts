import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('index route definition', () => {
  it('defines Route using createFileRoute for /', () => {
    const indexRouteFile = resolve(process.cwd(), 'src/routes/index.tsx')
    const source = readFileSync(indexRouteFile, 'utf8')

    expect(source).toContain("createFileRoute('/')")
    expect(source).toContain('export const Route =')
  })
})
