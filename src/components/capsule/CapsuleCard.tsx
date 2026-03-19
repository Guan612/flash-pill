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

  const accentClasses = {
    SEALED: 'from-[#5BCEFA]/28 to-[#5BCEFA]/8 border-[#5BCEFA]/30',
    FERMENTING: 'from-[#F5A9B8]/30 to-[#F5A9B8]/10 border-[#F5A9B8]/35',
    OPENED: 'from-[#5BCEFA]/24 to-[#F5A9B8]/16 border-[#8eacef]/35',
    ARCHIVED: 'from-slate-200/70 to-slate-100/40 border-slate-300/60',
  }

  return (
    <button
      type="button"
      onClick={() => onClick?.(capsule)}
      aria-label="查看胶囊详情"
      className={cn(
        'paper-note-card paper-note-card curation-card group relative flex h-full w-full overflow-hidden rounded-[1.6rem] p-4 text-left transition-all duration-300 cursor-pointer',
        'hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(91,206,250,0.14)]',
        sizeClasses[size],
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-x-4 top-3 h-14 rounded-[1.2rem] border bg-gradient-to-r blur-[0.2px] transition-transform duration-300 group-hover:scale-[1.02]',
          accentClasses[capsule.status],
        )}
      />

      <div
        aria-hidden="true"
        className={cn(
          'absolute right-4 top-4 h-12 w-12 rounded-2xl border border-white/70 bg-white/55 shadow-sm',
          capsule.status === 'FERMENTING' && 'rotate-6',
          capsule.status === 'SEALED' && '-rotate-3',
          capsule.status === 'OPENED' && 'rotate-3',
        )}
      />

      <div className="relative mb-3 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <span className="paper-chip inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#5c7e98]">
            {capsule.status}
          </span>
          <h3 className="line-clamp-2 pr-10 text-lg font-semibold leading-snug text-[#24455f]">
            {capsule.title || capsule.rawContent.slice(0, 50)}
          </h3>
        </div>
        <div className="shrink-0 pt-1">
          <span
            className={cn(
              'inline-block h-3 w-3 rounded-full ring-4 ring-white/90',
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
        <p className="relative mb-4 text-sm leading-6 text-[#5c7e98] line-clamp-4">
          {capsule.refinedContent || capsule.rawContent}
        </p>
      )}

      <div className="relative mt-auto space-y-3">
        {size === 'large' && capsule.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {capsule.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between text-xs text-[#5c7e98]">
          <span>{new Date(capsule.createdAt).toLocaleDateString()}</span>
          <CapsuleStatusBadge status={capsule.status} />
        </div>
      </div>
    </button>
  )
}
