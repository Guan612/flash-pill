/** @vitest-environment jsdom */
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import { Home } from '@/routes/index'
import type { Capsule } from '@/types/capsule'

const {
  mockUseSession,
  mockNavigate,
  invalidateQueries,
  mockCreateCapsule,
  mockGetAllCapsules,
} = vi.hoisted(() => ({
  mockUseSession: vi.fn(),
  mockNavigate: vi.fn(),
  invalidateQueries: vi.fn(),
  mockCreateCapsule: vi.fn(),
  mockGetAllCapsules: vi.fn(),
}))

vi.mock('@/services/auth/client', () => ({
  authClient: {
    useSession: mockUseSession,
  },
}))

vi.mock('@/services/capsule', () => ({
  createCapsule: mockCreateCapsule,
  getAllCapsules: mockGetAllCapsules,
}))

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')

  return {
    ...actual,
    useQuery: vi.fn(),
    useQueryClient: () => ({ invalidateQueries }),
  }
})

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockCapsule: Capsule = {
  id: 'c1',
  userId: 'u1',
  title: '测试胶囊',
  rawContent: '测试胶囊内容',
  refinedContent: '测试胶囊内容',
  isOpened: false,
  status: 'SEALED',
  type: 'IDEA',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  openAt: undefined,
  attachments: [],
  mood: undefined,
  location: undefined,
  tags: [],
}

function renderHomeWithQueryClient({
  capsules,
  isLoading = false,
  isError = false,
  session = { user: { id: 'u1', name: 'Test User' } },
}: {
  capsules: Capsule[]
  isLoading?: boolean
  isError?: boolean
  session?: { user: { id: string; name: string } } | null
}) {
  mockUseSession.mockReturnValue({
    data: session,
    isPending: false,
  })

  vi.mocked(useQuery).mockReturnValue({
    data: capsules,
    isLoading,
    isError,
    refetch: vi.fn(),
  } as unknown as ReturnType<typeof useQuery>)

  return render(<Home />)
}

describe('home route smoke', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    invalidateQueries.mockReset()
    mockCreateCapsule.mockReset()
    mockGetAllCapsules.mockReset()
  })

  it('shows a visitor landing state instead of fetch failure when logged out', () => {
    renderHomeWithQueryClient({ capsules: [], session: null })

    expect(screen.getByRole('button', { name: /登录开始记录/i })).toBeTruthy()
    expect(screen.getByText(/贴纸墙/i)).toBeTruthy()
    expect(screen.queryByText('加载失败，请重新拉取胶囊墙。')).toBeNull()
    expect(screen.queryByRole('button', { name: /记录闪念/i })).toBeNull()
  })

  it('clicking a capsule card triggers details navigation callback', async () => {
    renderHomeWithQueryClient({ capsules: [mockCapsule] })

    fireEvent.click(
      await screen.findByRole('button', { name: /查看胶囊详情/i }),
    )

    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/capsule/$id',
      params: { id: 'c1' },
    })
  })

  it('saving quick capture calls create and invalidates capsules query', async () => {
    mockCreateCapsule.mockResolvedValue(undefined)

    renderHomeWithQueryClient({ capsules: [] })

    fireEvent.click(screen.getByRole('button', { name: /记录闪念/i }))
    fireEvent.change(screen.getByPlaceholderText('此刻在想什么？'), {
      target: { value: '新的闪念' },
    })
    fireEvent.click(screen.getByRole('button', { name: '封存' }))

    await waitFor(() => {
      expect(mockCreateCapsule).toHaveBeenCalled()
      expect(invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['capsules'],
      })
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  it('opens mobile filters and toggles selected state without filtering data', async () => {
    renderHomeWithQueryClient({ capsules: [mockCapsule] })

    fireEvent.click(screen.getByRole('button', { name: /筛选/i }))

    const filterSheet = screen.getByRole('dialog', { name: /筛选视图/i })

    const filterOption = within(filterSheet).getByRole('button', {
      name: /灵感/i,
    })
    fireEvent.click(filterOption)

    await waitFor(() => {
      expect(filterOption.getAttribute('aria-pressed')).toBe('true')
      expect(
        screen.getAllByRole('button', { name: /查看胶囊详情/i }),
      ).toHaveLength(1)
    })
  })
})
