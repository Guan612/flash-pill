import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('index route definition', () => {
  it('defines Route using createFileRoute for /', () => {
    const indexRouteFile = resolve(process.cwd(), 'src/routes/index.tsx')
    const source = readFileSync(indexRouteFile, 'utf8')

    expect(source).toContain("createFileRoute('/')")
    expect(source).toContain('export const Route =')
    expect(source).toContain('HomeFilters')
    expect(source).toContain('QuickCaptureInput')
    expect(source).toContain('pattern[index % pattern.length]')
    expect(source).toContain('invalidateQueries')
    expect(source).toContain('/capsule/')
    expect(source).toContain('isLoading')
    expect(source).toContain('贴纸墙')
    expect(source).toContain('今日墙面')
    expect(source).toContain('重试')
  })
})
