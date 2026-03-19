# Sticky Note Card Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the home page cards into a more playful sticky-note wall with a light blue, pink, and white day theme while keeping creation, refresh, and detail navigation behavior unchanged.

**Architecture:** Keep the existing home route and bento layout, but shift the visual system away from glassy indigo cards toward solid white paper cards with blue/pink accent blocks. Scope the behavior changes to theme tokens, card rendering, and lightweight supportive UI so the data flow and route structure stay intact.

**Tech Stack:** React 19, TanStack Router, Vitest, Tailwind CSS v4, local CSS custom properties

---

## File Map

- Modify: `src/tests/index-route.test.ts`
- Modify: `src/tests/home-route-smoke.test.tsx`
- Modify: `src/tests/quick-capture-input.test.tsx`
- Modify: `src/styles/theme.css`
- Modify: `src/styles.css`
- Modify: `src/components/capsule/CapsuleCard.tsx`
- Modify: `src/components/capsule/QuickCaptureInput.tsx`
- Modify: `src/components/stats/StatsCard.tsx`
- Modify: `src/components/home/HomeFilters.tsx`
- Modify: `src/components/layout/BentoGrid.tsx`
- Modify: `src/routes/index.tsx`

### Task 1: Lock the visual contract in tests

**Files:**

- Modify: `src/tests/index-route.test.ts`
- Modify: `src/components/capsule/CapsuleCard.tsx`
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Write the failing test**

Add assertions for the new sticky-note presentation markers such as `贴纸墙`, `今日墙面`, and structural class hooks added to the route/card code.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/tests/index-route.test.ts`
Expected: FAIL because the new copy or class hooks are not present yet.

- [ ] **Step 3: Write minimal implementation**

Update the route and card code only enough to satisfy the new route-level expectations.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/tests/index-route.test.ts`
Expected: PASS.

### Task 2: Replace the day theme tokens

**Files:**

- Modify: `src/tests/index-route.test.ts`
- Modify: `src/styles/theme.css`
- Modify: `src/styles.css`
- Modify: `src/components/capsule/CapsuleCard.tsx`

- [ ] **Step 1: Write the failing test**

Extend `src/tests/index-route.test.ts` with explicit expectations for the new palette and class hooks, such as `#5BCEFA`, `#F5A9B8`, `paper-note-card`, or equivalent stable strings referenced by the route/card code.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/tests/index-route.test.ts`
Expected: FAIL for missing palette or class hooks.

- [ ] **Step 3: Write minimal implementation**

Replace indigo-heavy day-mode variables with `#5BCEFA`, `#F5A9B8`, and `#FFFFFF`, then add reusable paper/sticker utility classes for cards and chips.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/tests/index-route.test.ts`
Expected: PASS with the route-level hooks in place.

### Task 3: Refresh the card and supporting UI

**Files:**

- Modify: `src/components/capsule/CapsuleCard.tsx`
- Modify: `src/components/capsule/QuickCaptureInput.tsx`
- Modify: `src/components/stats/StatsCard.tsx`
- Modify: `src/components/home/HomeFilters.tsx`
- Modify: `src/components/layout/BentoGrid.tsx`
- Modify: `src/tests/home-route-smoke.test.tsx`
- Modify: `src/tests/quick-capture-input.test.tsx`
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Write the failing test**

Extend `src/tests/home-route-smoke.test.tsx` and `src/tests/quick-capture-input.test.tsx` with expectations for the new home heading/copy, precise mobile filter sheet open/close and selected-state highlight behavior, preserved create-refresh flow, and existing Quick Capture expanded/mobile-drawer behavior that must remain intact.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/tests/home-route-smoke.test.tsx src/tests/quick-capture-input.test.tsx`
Expected: FAIL because the new UI markers and interaction expectations are not rendered yet.

- [ ] **Step 3: Write minimal implementation**

Implement a paper-card layout in `CapsuleCard`, keep `QuickCaptureInput` desktop/mobile states visually aligned with the refreshed theme, soften stats and filter chips to match the palette, and adjust route copy/layout accents so the wall feels playful but readable. Add or keep route-level behavior so create success does not navigate away and preserves browsing context, with scroll drift staying within the spec target. If needed, tune `BentoGrid` card rhythm without changing the route or data architecture.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/tests/home-route-smoke.test.tsx src/tests/quick-capture-input.test.tsx`
Expected: PASS.

### Task 4: Verify integration

**Files:**

- Verify only

- [ ] **Step 1: Run focused tests**

Run: `npm test -- src/tests/index-route.test.ts src/tests/home-route-smoke.test.tsx src/tests/quick-capture-input.test.tsx`
Expected: PASS.

- [ ] **Step 2: Verify responsive and motion acceptance manually**

Run: `npm run dev`
Expected: Confirm at `375`, `768`, `1024`, and `1440` that there is no horizontal scroll, card rhythm stays readable, and reduced-motion mode removes movement-heavy effects.

- [ ] **Step 3: Verify theme readability manually**

Run: `npm run dev`
Expected: Confirm light mode uses the requested blue/pink/white palette, borders remain visible, dark mode remains readable if toggled, and body/meta text still meets the spec's readability target instead of washing out against white cards.

- [ ] **Step 4: Verify create and filter interaction acceptance manually**

Run: `npm run dev`
Expected: Confirm creating a capsule does not navigate away, the wall refresh stays in context, scroll position drift stays within roughly `±24px`, and mobile filters can open, toggle highlight state, and close without triggering real data filtering.

- [ ] **Step 5: Run full test suite if focused tests are green**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Run production build**

Run: `npm run build`
Expected: PASS.
