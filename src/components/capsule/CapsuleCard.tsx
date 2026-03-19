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
          <span
            className={cn(
              'h-3 w-3 rounded-full inline-block',
              capsule.status === 'SEALED' && 'bg-[#6366f1]',
              capsule.status === 'FERMENTING' && 'bg-[#ec4899]',
              capsule.status === 'OPENED' && 'bg-[#a855f7]',
              capsule.status === 'ARCHIVED' && 'bg-[#6b7280]',
            )}
          />
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
            <CapsuleStatusBadge status={capsule.status} />
          </div>
        </>
      )}
    </div>
  )
}
