import type { Tag } from '@/types/capsule'
import { cn } from '@/lib/utils'

interface TagBadgeProps {
  tag: Tag
  onClick?: (tag: Tag) => void
  className?: string
}

const tagColors = [
  'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300',
  'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
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
