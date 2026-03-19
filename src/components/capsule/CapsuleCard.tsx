import type { Capsule } from '@/types/capsule'
import { cn } from '@/lib/utils'
import { CapsuleStatus as CapsuleStatusBadge } from './CapsuleStatus'
import { TagBadge } from '../tags/TagBadge'

interface CapsuleCardProps {
  capsule: Capsule
  size?: 'small' | 'medium' | 'large'
  onClick?: (capsule: Capsule) => void
  className?: string
}

export function CapsuleCard({
  capsule,
  size = 'medium',
  onClick,
  className,
}: CapsuleCardProps) {
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 row-span-1 sm:row-span-2',
    large: 'col-span-1 row-span-1 sm:row-span-2 lg:col-span-2 lg:row-span-2',
  }

  return (
    <button
      type="button"
      onClick={() => onClick?.(capsule)}
      aria-label="查看胶囊详情"
      className={cn(
        'curation-card bg-glass flex h-full w-full flex-col rounded-[1.4rem] p-4 text-left transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(99,102,241,0.16)]',
        sizeClasses[size],
        className,
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {capsule.status}
          </span>
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug">
            {capsule.title || capsule.rawContent.slice(0, 50)}
          </h3>
        </div>
        <div className="shrink-0 pt-1">
          <span
            className={cn(
              'inline-block h-3 w-3 rounded-full ring-4 ring-background/70',
              capsule.status === 'SEALED' && 'bg-[var(--status-sealed)]',
              capsule.status === 'FERMENTING' &&
                'bg-[var(--status-fermenting)]',
              capsule.status === 'OPENED' && 'bg-[var(--status-opened)]',
              capsule.status === 'ARCHIVED' && 'bg-[var(--status-archived)]',
            )}
          />
        </div>
      </div>

      {(size === 'medium' || size === 'large') && (
        <p className="mb-4 text-sm leading-6 text-muted-foreground line-clamp-4">
          {capsule.refinedContent || capsule.rawContent}
        </p>
      )}

      <div className="mt-auto space-y-3">
        {size === 'large' && capsule.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {capsule.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{new Date(capsule.createdAt).toLocaleDateString()}</span>
          <CapsuleStatusBadge status={capsule.status} />
        </div>
      </div>
    </button>
  )
}
