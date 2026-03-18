import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('createCapsule server function', () => {
  it('uses inputValidator and request headers from server runtime', () => {
    const filePath = resolve(process.cwd(), 'src/lib/capsule.ts')
    const source = readFileSync(filePath, 'utf8')

    expect(source).toContain('.inputValidator(')
    expect(source).toContain('getRequestHeaders()')
  })
})
