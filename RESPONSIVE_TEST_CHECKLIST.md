# Responsive Design Test Checklist

## Overview

Manual browser testing required to verify responsive design and user interactions.

## Test Environments

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## Home Page Tests (`/`)

### Layout

- [ ] Bento grid displays correctly on all screen sizes
- [ ] Cards resize appropriately on different devices
- [ ] QuickCaptureInput spans full width
- [ ] Stats cards display correctly in 2-column layout
- [ ] Capsule cards display in grid with appropriate sizes (large, medium, small)

### Interactions

- [ ] QuickCaptureInput accepts text input
- [ ] Save button creates new capsule and refreshes list
- [ ] Capsule cards display correct content
- [ ] Clicking capsule card navigates to detail page
- [ ] Stats show correct counts (total capsules, weekly count)

### Visual Elements

- [ ] Glass morphism effects visible
- [ ] Cards have proper borders and shadows
- [ ] Typography is readable on all sizes
- [ ] Colors match design system

## Capsule Detail Page Tests (`/capsule/$id`)

### Layout

- [ ] Back to home link displays correctly
- [ ] Bento grid displays correctly on all screen sizes
- [ ] Main capsule content takes appropriate space
- [ ] Sidebar content displays properly

### Content Display

- [ ] Capsule title displays (or "无标题" if missing)
- [ ] Creation date shows correctly
- [ ] Mood displays if present
- [ ] Location displays if present
- [ ] Refined content displays (or raw content)
- [ ] Tags display as badges if present
- [ ] Related capsules section shows placeholder
- [ ] AI Analysis section shows placeholder

### Interactions

- [ ] Back to home link navigates correctly
- [ ] Capsule status badge displays correctly
- [ ] Tag badges display correctly

### Visual Elements

- [ ] Glass morphism effects visible
- [ ] Cards have proper borders and shadows
- [ ] Typography is readable on all sizes
- [ ] Prose formatting applied to content

## Edge Cases

- [ ] Empty state (no capsules)
- [ ] Loading states display correctly
- [ ] Error states handle appropriately
- [ ] Very long content displays correctly
- [ ] Many tags wrap appropriately

## Performance

- [ ] Page loads quickly on all devices
- [ ] No visual jank when resizing
- [ ] Smooth transitions between pages

## Notes

- Testing should be performed in Chrome, Firefox, and Safari
- Both light and dark mode should be verified
- Test with real data and various capsule states
