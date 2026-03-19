# Blue Pink Curation Wall Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the `/` homepage into a blue-pink-white curation wall where capsule cards are the primary focus and quick capture becomes a lightweight floating workflow.

**Architecture:** Keep TanStack Query data flow unchanged (`getAllCapsules` + `createCapsule`) and refactor presentation boundaries: route orchestrates layout, `BentoGrid` controls responsive spans, card/input/filter components own interaction and styling variants. Theme tokens are centralized in CSS so existing routes inherit the new visual language safely.

**Tech Stack:** React 19, TanStack Router, TanStack Query, Tailwind CSS v4, TypeScript, Vitest, Testing Library

---

## File Structure Map

### Create

- `src/components/home/HomeFilters.tsx` - Desktop chips + mobile sheet shell for filter UI states (no data filtering logic)
- `src/tests/quick-capture-input.test.tsx` - Component interaction tests for collapsed/expanded quick capture behavior
- `src/tests/home-route-smoke.test.tsx` - Runtime smoke tests for card click + create-refresh path

### Modify

- `src/routes/index.tsx` - Curation-first page composition, card size pattern, empty-state placeholders
- `src/components/layout/BentoGrid.tsx` - Updated responsive columns and reusable auto-row behavior
- `src/components/capsule/CapsuleCard.tsx` - New card hierarchy, status accent, keyboard/click interaction polish
- `src/components/capsule/QuickCaptureInput.tsx` - Desktop floating composer + mobile drawer trigger + success/error feedback
- `src/components/stats/StatsCard.tsx` - Downgrade to micro-stat chip style
- `src/components/Header.tsx` - Replace emoji logo with icon-based mark and tune nav surface style
- `src/styles/theme.css` - Blue/pink/white glass tokens and utility layer updates
- `src/styles.css` - Global background/text token alignment and motion accessibility
- `src/tests/index-route.test.ts` - Route-level structure assertions for new homepage composition

---

### Task 1: Lock Behavior With Failing Tests

**Files:**

- Modify: `src/tests/index-route.test.ts`
- Create: `src/tests/quick-capture-input.test.tsx`
- Create: `src/tests/home-route-smoke.test.tsx`

- [ ] **Step 1: Update route source assertions for curation layout structure**

```ts
expect(source).toContain('HomeFilters')
expect(source).toContain('QuickCaptureInput')
expect(source).toContain('pattern[index % pattern.length]')
expect(source).toContain('invalidateQueries')
expect(source).toContain('/capsule/')
expect(source).toContain('isLoading')
expect(source).toContain('重试')
```

- [ ] **Step 2: Add runtime homepage smoke tests (card click + create-refresh)**

```tsx
/** @vitest-environment jsdom */
it('clicking a capsule card triggers details navigation callback', async () => {
  renderHomeWithQueryClient({ capsules: [mockCapsule] })
  fireEvent.click(await screen.findByRole('button', { name: /查看胶囊详情/i }))
  expect(mockNavigate).toHaveBeenCalledWith('/capsule/c1')
})

it('saving quick capture calls create and invalidates capsules query', async () => {
  renderHomeWithQueryClient({ capsules: [] })
  // open composer -> type -> save
  expect(mockCreateCapsule).toHaveBeenCalled()
  expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
    queryKey: ['capsules'],
  })
})
```

- [ ] **Step 3: Add jsdom component tests for quick capture states**

```tsx
/** @vitest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react'

it('expands desktop composer when trigger clicked', () => {
  render(<QuickCaptureInput onSave={mockSave} />)
  fireEvent.click(screen.getByRole('button', { name: /记录闪念/i }))
  expect(screen.getByPlaceholderText('此刻在想什么？')).toBeTruthy()
})
```

- [ ] **Step 4: Add save-success + failure-retention assertions in component test**

```tsx
fireEvent.change(screen.getByPlaceholderText('此刻在想什么？'), {
  target: { value: '测试内容' },
})
fireEvent.click(screen.getByRole('button', { name: '封存' }))
expect(await screen.findByText('已封存到胶囊墙')).toBeTruthy()

mockSave.mockRejectedValueOnce(new Error('boom'))
fireEvent.change(screen.getByPlaceholderText('此刻在想什么？'), {
  target: { value: '失败时保留输入' },
})
fireEvent.click(screen.getByRole('button', { name: '封存' }))
expect(await screen.findByRole('alert')).toBeTruthy()
expect(screen.getByDisplayValue('失败时保留输入')).toBeTruthy()

// mobile path: trigger -> drawer open -> close
fireEvent.click(screen.getByRole('button', { name: /打开移动端记录面板/i }))
expect(screen.getByRole('dialog', { name: /快速记录面板/i })).toBeTruthy()
fireEvent.click(screen.getByRole('button', { name: /关闭记录面板/i }))
expect(screen.queryByRole('dialog', { name: /快速记录面板/i })).toBeNull()
```

- [ ] **Step 5: Run targeted tests and verify FAIL (red stage)**

Run: `npm test -- src/tests/index-route.test.ts src/tests/quick-capture-input.test.tsx src/tests/home-route-smoke.test.tsx`

Expected: At least one assertion fails because runtime smoke hooks and new QuickCapture fallback behavior are not implemented yet.

- [ ] **Step 6: Commit test scaffolding**

```bash
git add src/tests/index-route.test.ts src/tests/quick-capture-input.test.tsx src/tests/home-route-smoke.test.tsx
git commit -m "test: add failing coverage for curation wall interactions"
```

---

### Task 2: Implement Quick Capture + Filter Shell (Minimal Green)

**Files:**

- Create: `src/components/home/HomeFilters.tsx`
- Modify: `src/components/capsule/QuickCaptureInput.tsx`

- [ ] **Step 1: Implement `HomeFilters` UI-only state container**

```tsx
const [open, setOpen] = useState(false)
const [selected, setSelected] = useState<string[]>([])
// desktop chips + mobile bottom sheet trigger
```

- [ ] **Step 2: Refactor `QuickCaptureInput` into desktop collapsed/expanded flow**

```tsx
const [isExpanded, setIsExpanded] = useState(false)
const [feedback, setFeedback] = useState<{
  type: 'success' | 'error'
  text: string
} | null>(null)
```

- [ ] **Step 3: Add mobile floating trigger + bottom drawer composer**

```tsx
<button
  className="sm:hidden fixed bottom-6 right-4"
  onClick={() => setMobileOpen(true)}
>
  记录
</button>
```

- [ ] **Step 4: Replace emoji affordances with Lucide SVG icons**

```tsx
import { Mic, Tags, Sparkles } from 'lucide-react'
```

- [ ] **Step 5: Run component test only and verify PASS (green stage)**

Run: `npm test -- src/tests/quick-capture-input.test.tsx`

Expected: PASS, including expand/collapse and save feedback assertions.

- [ ] **Step 6: Commit quick capture/filter changes**

```bash
git add src/components/capsule/QuickCaptureInput.tsx src/components/home/HomeFilters.tsx
git commit -m "feat: add floating quick capture states and filter shell UI"
```

---

### Task 3: Recompose Homepage Into Curation Wall

**Files:**

- Modify: `src/routes/index.tsx`
- Modify: `src/components/layout/BentoGrid.tsx`
- Modify: `src/components/capsule/CapsuleCard.tsx`
- Modify: `src/components/stats/StatsCard.tsx`
- Modify: `src/components/Header.tsx`

- [ ] **Step 1: Encode card-size pattern helper in route**

```ts
const pattern: Array<
  'large' | 'small' | 'medium' | 'small' | 'small' | 'medium'
> = ['large', 'small', 'medium', 'small', 'small', 'medium']

const sizeForIndex = (index: number) => pattern[index % pattern.length]
```

- [ ] **Step 2: Move stats out of main grid and place as micro strip**

```tsx
<div className="mb-4 flex flex-wrap items-center gap-2">
  <StatsCard label="总胶囊" value={totalCapsules} />
  <StatsCard label="本周新增" value={thisWeekCapsules} variant="secondary" />
</div>
```

- [ ] **Step 3: Wire `HomeFilters` and `QuickCaptureInput` into sticky/floating positions**

```tsx
<div className="sticky top-[4.5rem] z-30 mb-5">
  <QuickCaptureInput onSave={handleSave} />
</div>
```

- [ ] **Step 4: Update `BentoGrid` + `CapsuleCard` span logic for breakpoints**

```tsx
// grid columns: 1 / 2 / 3 / 4 at <640 / >=640 / >=1024 / >=1440
className =
  'grid grid-cols-1 gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3 min-[1440px]:grid-cols-4'

// downgrade behavior encoded in CSS classes:
// medium: 1x1 on mobile, 1x2 from >=640
// large: 1x1 on mobile, 1x2 at 640-1023, 2x2 from >=1024
const sizeClasses = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-1 row-span-1 sm:row-span-2',
  large: 'col-span-1 row-span-1 sm:row-span-2 lg:col-span-2 lg:row-span-2',
}
```

- [ ] **Step 5: Add loading skeleton + error banner/retry for non-happy paths**

```tsx
if (isLoading) {
  return <CapsuleWallSkeleton />
}

const showErrorBanner = isError

{
  showErrorBanner && (
    <div role="alert" className="mb-4">
      加载失败
      <button onClick={() => refetch()}>重试</button>
    </div>
  )
}
```

- [ ] **Step 6: Add empty-state placeholder cards to preserve visual rhythm**

```tsx
{
  capsules.length === 0 && <EmptyGuideCards />
}
```

- [ ] **Step 7: Replace header emoji with icon mark to match design quality bar**

```tsx
import { Pill } from 'lucide-react'
```

- [ ] **Step 8: Run route + component tests and verify PASS**

Run: `npm test -- src/tests/index-route.test.ts src/tests/quick-capture-input.test.tsx src/tests/home-route-smoke.test.tsx`

Expected: PASS with route smoke assertions (click path, refresh path, loading/error hooks) and quick-capture interaction assertions.

- [ ] **Step 9: Commit layout and component composition changes**

```bash
git add src/routes/index.tsx src/components/layout/BentoGrid.tsx src/components/capsule/CapsuleCard.tsx src/components/stats/StatsCard.tsx src/components/Header.tsx
git commit -m "feat: recompose home into curation-first bento wall"
```

- [ ] **Step 10: Run explicit browsing-context verification for save flow**

Run: `npm run dev`

Manual procedure:

1. Open `http://localhost:6800/` and in DevTools console run: `window.__before = window.scrollY` after scrolling to ~600px.
2. Submit a quick capture item.
3. In console run: `({ path: location.pathname, delta: Math.abs(window.scrollY - window.__before) })`.

Expected: `path` remains `'/'` and `delta <= 24`.

---

### Task 4: Apply Blue/Pink/White Theme Tokens + Verify

**Files:**

- Modify: `src/styles/theme.css`
- Modify: `src/styles.css`

- [ ] **Step 1: Replace sea-green token values with blue/pink/white palette values**

```css
:root {
  --sea-ink: #1f2552;
  --lagoon: #6366f1;
  --hero-a: rgba(99, 102, 241, 0.22);
  --hero-b: rgba(236, 72, 153, 0.18);
}
```

- [ ] **Step 2: Update `bg-glass` / border utilities for visible light-mode glass cards**

```css
.light {
  --bg-glass: rgba(255, 255, 255, 0.82);
  --border-glass: rgba(99, 102, 241, 0.18);
}
```

- [ ] **Step 3: Add reduced-motion fallback for card transitions**

```css
@media (prefers-reduced-motion: reduce) {
  .curation-card {
    transition: opacity 120ms ease;
    transform: none !important;
  }
}
```

- [ ] **Step 4: Run full test suite**

Run: `npm test`

Expected: PASS for all tests.

- [ ] **Step 5: Run lint check**

Run: `npm run lint`

Expected: No lint errors.

- [ ] **Step 6: Commit theme and final verification updates**

```bash
git add src/styles/theme.css src/styles.css
git commit -m "style: apply blue-pink-white curation theme tokens"
```

---

## Final Verification Checklist

- [ ] Homepage first-screen focus is capsule cards, not input or stats blocks
- [ ] Quick capture works on desktop collapsed mode and mobile drawer mode
- [ ] Filter interaction is UI-only (open/close + selected visual state), no data filtering side effects
- [ ] Card spans follow `Large/Small/Medium/Small/Small/Medium` pattern with breakpoint downgrades
- [ ] No emoji icons in interactive UI controls
- [ ] `prefers-reduced-motion` removes movement-heavy effects
- [ ] Responsive checks at `375 / 768 / 1024 / 1440` show correct columns and no horizontal scroll
- [ ] Light and dark mode both keep readable text contrast and visible card borders
- [ ] Create flow keeps browsing context: after save no route jump and scroll offset delta <= ±24px
- [ ] `npm test` passes
- [ ] `npm run lint` passes
