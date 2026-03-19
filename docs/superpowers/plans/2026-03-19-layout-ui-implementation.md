# Flash Pill Layout & UI Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor flash-pill application to use responsive Bento Grid layout with blue-pink-white theme, creating reusable components with mobile-first design.

**Architecture:** All pages use unified BentoGrid component with CSS Grid, responsive breakpoints (1/2/3/4 columns), glass-morphism design system, and TanStack Query for data fetching.

**Tech Stack:** React, TanStack Router, TanStack Query, Tailwind CSS v4, TypeScript

---

## File Structure Map

### New Files

- `src/components/layout/BentoGrid.tsx` - Grid container with responsive breakpoints
- `src/components/layout/PageContainer.tsx` - Page wrapper with background decorations
- `src/components/capsule/CapsuleCard.tsx` - Capsule display card (3 size variants)
- `src/components/capsule/QuickCaptureInput.tsx` - Quick capture input with save
- `src/components/capsule/CapsuleStatus.tsx` - Status indicator component
- `src/components/stats/StatsCard.tsx` - Statistics display card
- `src/components/tags/TagBadge.tsx` - Tag badge component
- `src/types/capsule.ts` - TypeScript interfaces for Capsule, Tag, etc.
- `src/styles/theme.css` - Custom CSS for gradients, glass-morphism, animations

### Modified Files

- `src/components/Header.tsx` - Simplify Header (remove social links, nav links)
- `src/routes/__root.tsx` - No changes needed (Header is separate component)
- `src/routes/index.tsx` - Refactor to Bento Grid layout
- `src/routes/capsule/$id.tsx` - Create detail page with Grid layout
- `src/services/capsule/index.ts` - Implement getAllCapsules, getCapsuleById (createCapsule already exists)

### Existing Utilities (No Changes Needed)

- `src/lib/utils.ts` - Contains `cn` utility function (already exists)
- `src/services/capsule/index.ts` - Contains `createCapsule` server function (already exists)

---

## Task 1: Create Type Definitions

**Files:**

- Create: `src/types/capsule.ts`

- [ ] **Step 1: Create Capsule type definitions**

```typescript
export enum CapsuleStatus {
  SEALED = 'SEALED',
  FERMENTING = 'FERMENTING',
  OPENED = 'OPENED',
  ARCHIVED = 'ARCHIVED',
}

export enum CapsuleType {
  IDEA = 'IDEA',
  TODO = 'TODO',
  MEMO = 'MEMO',
  INSIGHT = 'INSIGHT',
}

export interface Tag {
  id: string
  name: string
}

export interface Attachment {
  id: string
  type: 'IMAGE' | 'AUDIO' | 'FILE'
  url: string
  fileName?: string
  duration?: number
}

export interface Capsule {
  id: string
  userId: string
  title?: string
  rawContent: string
  refinedContent?: string
  status: CapsuleStatus
  type: CapsuleType
  createdAt: string
  updatedAt: string
  openAt?: string
  attachments: Attachment[]
  mood?: string
  location?: string
  tags: Tag[]
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/types/capsule.ts
git commit -m "feat: add Capsule type definitions"
```

---

## Task 2: Implement Server Functions

**Files:**

- Modify: `src/services/capsule/index.ts`

**Note:** The file already has a `createCapsule` export (used by QuickCaptureInput). We'll implement the empty `findAllCapsule` function as `getAllCapsules` and add `getCapsuleById`.

- [ ] **Step 1: Implement getAllCapsules server function**

```typescript
export const getAllCapsules = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw new Error('未登录，无法获取闪念')
    }

    const capsules = await prisma.capsule.findMany({
      where: { userId: session.user.id },
      include: {
        tags: true,
        attachments: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return capsules
  },
)
```

- [ ] **Step 2: Add getCapsuleById server function**

```typescript
export const getCapsuleById = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw new Error('未登录，无法获取闪念')
    }

    const capsule = await prisma.capsule.findUnique({
      where: { id: data.id },
      include: {
        tags: true,
        attachments: true,
      },
    })

    if (!capsule || capsule.userId !== session.user.id) {
      throw new Error('闪念不存在或无权访问')
    }

    return capsule
  })
```

- [ ] **Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/services/capsule/index.ts
git commit -m "feat: add getAllCapsules and getCapsuleById server functions"
```

---

## Task 3: Create Custom CSS Theme

**Files:**

- Create: `src/styles/theme.css`

- [ ] **Step 1: Create theme CSS with gradients and glass-morphism**

```css
@layer base {
  :root {
    --gradient-blue: linear-gradient(135deg, #6366f1, #3b82f6);
    --gradient-pink: linear-gradient(135deg, #ec4899, #f472b6);
    --gradient-mixed: linear-gradient(135deg, #6366f1, #ec4899);

    --status-sealed: #6366f1;
    --status-fermenting: #ec4899;
    --status-opened: #a855f7;
    --status-archived: #6b7280;
  }

  .dark {
    --bg-glass: rgba(15, 23, 42, 0.7);
    --border-glass: rgba(51, 65, 85, 0.5);
  }

  .light {
    --bg-glass: rgba(255, 255, 255, 0.7);
    --border-glass: rgba(255, 255, 255, 0.5);
  }
}

@layer utilities {
  .bg-glass {
    background: var(--bg-glass);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--border-glass);
  }

  .bg-pattern-light {
    background-image:
      radial-gradient(
        circle at 20% 20%,
        rgba(99, 102, 241, 0.2) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 80%,
        rgba(236, 72, 153, 0.2) 0%,
        transparent 50%
      );
  }

  .bg-pattern-dark {
    background-image:
      radial-gradient(
        circle at 20% 20%,
        rgba(99, 102, 241, 0.3) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 80%,
        rgba(236, 72, 153, 0.3) 0%,
        transparent 50%
      );
  }

  .gradient-border {
    position: relative;
    background: var(--bg-glass);
  }

  .gradient-border::before {
    content: '';
    position: absolute;
    inset: 0;
    padding: 2px;
    background: var(--gradient-mixed);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    border-radius: inherit;
    pointer-events: none;
  }
}
```

- [ ] **Step 2: Import theme in styles.css**

Check file: `src/styles.css`
Add at top: `@import './theme.css';`

- [ ] **Step 3: Commit**

```bash
git add src/styles/theme.css src/styles.css
git commit -m "feat: add theme CSS with gradients and glass-morphism"
```

---

## Task 4: Create BentoGrid Layout Component

**Files:**

- Create: `src/components/layout/BentoGrid.tsx`

- [ ] **Step 1: Create BentoGrid component**

```typescript
import { type ReactNode } from 'react'

interface BentoGridProps {
  children: ReactNode
  className?: string
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/BentoGrid.tsx
git commit -m "feat: add BentoGrid layout component"
```

---

## Task 5: Create PageContainer Component

**Files:**

- Create: `src/components/layout/PageContainer.tsx`

- [ ] **Step 1: Create PageContainer component**

```typescript
import { type ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`min-h-screen bg-pattern-light dark:bg-pattern-dark transition-colors duration-300 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/PageContainer.tsx
git commit -m "feat: add PageContainer with background decorations"
```

---

## Task 6: Create CapsuleStatus Component

**Files:**

- Create: `src/components/capsule/CapsuleStatus.tsx`

- [ ] **Step 1: Create CapsuleStatus component**

```typescript
import { CapsuleStatus as CapsuleStatusEnum } from '@/types/capsule'
import { cn } from '@/lib/utils'

interface CapsuleStatusProps {
  status: CapsuleStatusEnum
  className?: string
}

const statusColors: Record<CapsuleStatusEnum, string> = {
  [CapsuleStatusEnum.SEALED]: 'bg-[#6366f1]',
  [CapsuleStatusEnum.FERMENTING]: 'bg-[#ec4899]',
  [CapsuleStatusEnum.OPENED]: 'bg-[#a855f7]',
  [CapsuleStatusEnum.ARCHIVED]: 'bg-[#6b7280]',
}

const statusLabels: Record<CapsuleStatusEnum, string> = {
  [CapsuleStatusEnum.SEALED]: '封存中',
  [CapsuleStatusEnum.FERMENTING]: '发酵中',
  [CapsuleStatusEnum.OPENED]: '已开启',
  [CapsuleStatusEnum.ARCHIVED]: '已归档',
}

export function CapsuleStatus({ status, className }: CapsuleStatusProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
        statusColors[status],
        'text-white',
        className,
      )}
    >
      <span className="h-2 w-2 rounded-full bg-white" />
      <span>{statusLabels[status]}</span>
    </div>
  )
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/capsule/CapsuleStatus.tsx
git commit -m "feat: add CapsuleStatus indicator component"
```

---

## Task 7: Create TagBadge Component

**Files:**

- Create: `src/components/tags/TagBadge.tsx`

- [ ] **Step 1: Create TagBadge component**

```typescript
import { Tag } from '@/types/capsule'
import { cn } from '@/lib/utils'

interface TagBadgeProps {
  tag: Tag
  onClick?: (tag: Tag) => void
  className?: string
}

const tagColors = [
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
]

export function TagBadge({ tag, onClick, className }: TagBadgeProps) {
  const colorIndex = tag.id.length % tagColors.length

  return (
    <button
      onClick={() => onClick?.(tag)}
      className={cn(
        'rounded-full px-3 py-1 text-xs font-medium transition-colors hover:opacity-80',
        tagColors[colorIndex],
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {tag.name}
    </button>
  )
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/tags/TagBadge.tsx
git commit -m "feat: add TagBadge component"
```

---

## Task 8: Create CapsuleCard Component

**Files:**

- Create: `src/components/capsule/CapsuleCard.tsx`

- [ ] **Step 1: Create CapsuleCard component with 3 size variants**

```typescript
import { Capsule, CapsuleStatus as CapsuleStatusEnum } from '@/types/capsule'
import { cn } from '@/lib/utils'
import { CapsuleStatus } from './CapsuleStatus'
import { TagBadge } from '../tags/TagBadge'

interface CapsuleCardProps {
  capsule: Capsule
  size?: 'small' | 'medium' | 'large'
  onClick?: (capsule: Capsule) => void
  className?: string
}

export function CapsuleCard({ capsule, size = 'medium', onClick, className }: CapsuleCardProps) {
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 row-span-2',
    large: 'col-span-2 row-span-2',
  }

  return (
    <div
      onClick={() => onClick?.(capsule)}
      className={cn(
        'bg-glass rounded-xl p-4 cursor-pointer transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)]',
        sizeClasses[size],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-lg line-clamp-1">
          {capsule.title || capsule.rawContent.slice(0, 50)}
        </h3>
        <div className="shrink-0">
          <span className={cn(
            'h-3 w-3 rounded-full inline-block',
            capsule.status === CapsuleStatusEnum.SEALED && 'bg-[#6366f1]',
            capsule.status === CapsuleStatusEnum.FERMENTING && 'bg-[#ec4899]',
            capsule.status === CapsuleStatusEnum.OPENED && 'bg-[#a855f7]',
            capsule.status === CapsuleStatusEnum.ARCHIVED && 'bg-[#6b7280]',
          )} />
        </div>
      </div>

      {(size === 'medium' || size === 'large') && (
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {capsule.refinedContent || capsule.rawContent}
        </p>
      )}

      {size === 'large' && (
        <>
          <div className="flex flex-wrap gap-2 mb-3">
            {capsule.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{new Date(capsule.createdAt).toLocaleDateString()}</span>
            <CapsuleStatus status={capsule.status} />
          </div>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/capsule/CapsuleCard.tsx
git commit -m "feat: add CapsuleCard with 3 size variants"
```

---

## Task 9: Create QuickCaptureInput Component

**Files:**

- Create: `src/components/capsule/QuickCaptureInput.tsx`

- [ ] **Step 1: Create QuickCaptureInput component**

```typescript
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface QuickCaptureInputProps {
  onSave: (content: string) => Promise<void>
  placeholder?: string
  className?: string
}

export function QuickCaptureInput({ onSave, placeholder = '此刻在想什么？', className }: QuickCaptureInputProps) {
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!content.trim()) return

    setIsSaving(true)
    try {
      await onSave(content)
      setContent('')
    } catch (err) {
      console.error(err)
      alert('保存失败')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={cn('gradient-border rounded-2xl p-4', className)}>
      <Textarea
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[120px] resize-none border-0 bg-transparent focus:ring-0 text-base"
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault()
            handleSave()
          }
        }}
      />
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-[#6366f1]">🎤</span>
          <span>🏷️</span>
          <span className="opacity-50">⌘/Ctrl + Enter 保存</span>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving || !content.trim()}
          className="bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600"
        >
          {isSaving ? '保存中...' : '封存'}
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/capsule/QuickCaptureInput.tsx
git commit -m "feat: add QuickCaptureInput with keyboard shortcut"
```

---

## Task 10: Create StatsCard Component

**Files:**

- Create: `src/components/stats/StatsCard.tsx`

- [ ] **Step 1: Create StatsCard component**

```typescript
import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: number
  variant?: 'primary' | 'secondary'
  className?: string
}

export function StatsCard({ label, value, variant = 'primary', className }: StatsCardProps) {
  const gradientClass = variant === 'primary'
    ? 'bg-gradient-to-br from-indigo-500 to-pink-500'
    : 'bg-gradient-to-br from-purple-500 to-pink-500'

  return (
    <div
      className={cn(
        'rounded-xl p-4 text-white',
        gradientClass,
        className,
      )}
    >
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  )
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/stats/StatsCard.tsx
git commit -m "feat: add StatsCard component"
```

---

## Task 11: Simplify Header Component

**Files:**

- Modify: `src/components/Header.tsx`

- [ ] **Step 1: Replace Header with simplified version**

```typescript
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
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.tsx
git commit -m "refactor: simplify Header for flash-pill theme"
```

---

## Task 12: Refactor Home Page

**Files:**

- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Refactor index.tsx with Bento Grid layout**

```typescript
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { BentoGrid } from '@/components/layout/BentoGrid'
import { PageContainer } from '@/components/layout/PageContainer'
import { QuickCaptureInput } from '@/components/capsule/QuickCaptureInput'
import { CapsuleCard } from '@/components/capsule/CapsuleCard'
import { StatsCard } from '@/components/stats/StatsCard'
import { getAllCapsules, createCapsule } from '@/services/capsule'
import { queryClient } from '@/integrations/tanstack-query/root-provider'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { data: capsules = [] } = useQuery({
    queryKey: ['capsules'],
    queryFn: () => getAllCapsules(),
  })

  const handleSave = async (content: string) => {
    await createCapsule({ data: { content } })
    await queryClient.invalidateQueries({ queryKey: ['capsules'] })
  }

  const totalCapsules = capsules.length
  const thisWeekCapsules = capsules.filter((c: any) => {
    const createdAt = new Date(c.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return createdAt >= weekAgo
  }).length

  return (
    <PageContainer>
      <BentoGrid>
        <QuickCaptureInput onSave={handleSave} className="col-span-full" />

        <StatsCard
          label="总胶囊"
          value={totalCapsules}
          className="col-span-1"
        />

        <StatsCard
          label="本周新增"
          value={thisWeekCapsules}
          variant="secondary"
          className="col-span-1"
        />

        {capsules.map((capsule: any, index: number) => (
          <CapsuleCard
            key={capsule.id}
            capsule={capsule}
            size={index % 3 === 0 ? 'large' : index % 2 === 0 ? 'medium' : 'small'}
            onClick={() => window.location.href = `/capsule/${capsule.id}`}
          />
        ))}
      </BentoGrid>
    </PageContainer>
  )
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/routes/index.tsx
git commit -m "refactor: home page with Bento Grid layout"
```

---

## Task 13: Create Capsule Detail Page

**Files:**

- Create: `src/routes/capsule/$id.tsx`

- [ ] **Step 1: Create capsule detail page**

```typescript
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { BentoGrid } from '@/components/layout/BentoGrid'
import { PageContainer } from '@/components/layout/PageContainer'
import { CapsuleStatus } from '@/components/capsule/CapsuleStatus'
import { TagBadge } from '@/components/tags/TagBadge'
import { getCapsuleById } from '@/services/capsule'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/capsule/$id')({
  component: CapsuleDetail,
})

function CapsuleDetail() {
  const { id } = Route.useParams()
  const { data: capsule, isLoading } = useQuery({
    queryKey: ['capsule', id],
    queryFn: () => getCapsuleById({ id }),
  })

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-muted-foreground">加载中...</div>
        </div>
      </PageContainer>
    )
  }

  if (!capsule) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-muted-foreground">胶囊不存在</div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        ← 返回首页
      </Link>

      <BentoGrid>
        <div className="col-span-1 bg-glass rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold">
              {capsule.title || '无标题'}
            </h1>
            <CapsuleStatus status={capsule.status} />
          </div>

          <div className="text-sm text-muted-foreground mb-4">
            创建于: {new Date(capsule.createdAt).toLocaleString()}
          </div>

          {capsule.mood && (
            <div className="text-sm text-muted-foreground mb-2">
              心情: {capsule.mood}
            </div>
          )}

          {capsule.location && (
            <div className="text-sm text-muted-foreground mb-4">
              地点: {capsule.location}
            </div>
          )}

          <div className="prose prose-sm max-w-none">
            {capsule.refinedContent || capsule.rawContent}
          </div>

          {capsule.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {capsule.tags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} />
              ))}
            </div>
          )}
        </div>

        <div className="col-span-2 bg-glass rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">关联胶囊</h2>
          <div className="text-muted-foreground">
            暂无关联胶囊（功能开发中）
          </div>

          <h2 className="text-xl font-bold mb-4 mt-8">AI 分析</h2>
          <div className="text-muted-foreground">
            AI 分析功能开发中
          </div>
        </div>
      </BentoGrid>
    </PageContainer>
  )
}
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/routes/capsule/
git commit -m "feat: add capsule detail page with Grid layout"
```

---

## Task 14: Add Responsive Design Tests

**Files:**

- Modify: `src/routes/index.tsx`
- Modify: `src/routes/capsule/$id.tsx`

- [ ] **Step 1: Test responsive layout in browser**

Run: `bun run dev`

Test steps:

1. Open browser at http://localhost:6800
2. Resize browser to different breakpoints:
   - Mobile (<640px): Should be 1 column
   - Tablet (640px-1024px): Should be 2-3 columns
   - Desktop (>1024px): Should be 4 columns
3. Verify cards wrap correctly
4. Test dark/light theme toggle

- [ ] **Step 2: Test capsule interactions**

Test steps:

1. Type content in QuickCaptureInput
2. Press Ctrl+Enter to save
3. Verify new capsule appears
4. Click capsule card to navigate to detail page
5. Verify detail page displays correctly

- [ ] **Step 3: Test glass-morphism effects**

Test steps:

1. Check background decorations (blue/pink gradients) are visible
2. Verify glass effect on cards (backdrop blur, transparency)
3. Test hover effects (border glow, card lift)

- [ ] **Step 4: Commit responsive fixes**

```bash
git add .
git commit -m "test: verify responsive design and interactions"
```

---

## Task 15: Final Cleanup and Linting

**Files:**

- All modified files

- [ ] **Step 1: Run linting**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 2: Run formatting**

Run: `npm run format`
Expected: All files formatted

- [ ] **Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Run tests**

Run: `npm run test`
Expected: All tests pass

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: final cleanup - linting, formatting, type checking"
```

---

## Verification Checklist

After completing all tasks:

- [ ] Home page displays with Bento Grid layout
- [ ] QuickCaptureInput works with keyboard shortcut
- [ ] Capsule cards display in 3 size variants
- [ ] Responsive design works (mobile/tablet/desktop)
- [ ] Dark/light theme toggle works
- [ ] Glass-morphism effects visible
- [ ] Blue-pink-white theme colors applied
- [ ] Navigation to capsule detail page works
- [ ] All TypeScript checks pass
- [ ] All linting passes
- [ ] All tests pass
