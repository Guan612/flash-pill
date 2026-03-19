/** @vitest-environment jsdom */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { QuickCaptureInput } from '@/components/capsule/QuickCaptureInput'

describe('QuickCaptureInput', () => {
  it('expands desktop composer when trigger clicked', () => {
    const mockSave = vi.fn().mockResolvedValue(undefined)

    render(<QuickCaptureInput onSave={mockSave} />)

    fireEvent.click(screen.getByRole('button', { name: /记录闪念/i }))

    expect(screen.getByPlaceholderText('此刻在想什么？')).toBeTruthy()
  })

  it('shows success feedback and keeps content on save failure', async () => {
    const mockSave = vi
      .fn<(_: string) => Promise<void>>()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('boom'))

    render(<QuickCaptureInput onSave={mockSave} />)

    fireEvent.click(screen.getByRole('button', { name: /记录闪念/i }))
    fireEvent.change(screen.getByPlaceholderText('此刻在想什么？'), {
      target: { value: '测试内容' },
    })
    fireEvent.click(screen.getByRole('button', { name: '封存' }))

    expect(await screen.findByText('已封存到胶囊墙')).toBeTruthy()

    fireEvent.change(screen.getByPlaceholderText('此刻在想什么？'), {
      target: { value: '失败时保留输入' },
    })
    fireEvent.click(screen.getByRole('button', { name: '封存' }))

    expect(await screen.findByRole('alert')).toBeTruthy()
    expect(screen.getByDisplayValue('失败时保留输入')).toBeTruthy()
  })

  it('opens and closes mobile drawer composer', async () => {
    const mockSave = vi.fn().mockResolvedValue(undefined)

    render(<QuickCaptureInput onSave={mockSave} />)

    fireEvent.click(screen.getByRole('button', { name: /打开移动端记录面板/i }))

    expect(screen.getByRole('dialog', { name: /快速记录面板/i })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /关闭记录面板/i }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /快速记录面板/i })).toBeNull()
    })
  })
})
