import type { CapsuleStatus } from '@/types/capsule'
import { cn } from '@/lib/utils'

interface CapsuleStatusProps {
  status: CapsuleStatus
  className?: string
}

const statusColors: Record<CapsuleStatus, string> = {
  SEALED: 'bg-[#6366f1]',
  FERMENTING: 'bg-[#ec4899]',
  OPENED: 'bg-[#a855f7]',
  ARCHIVED: 'bg-[#6b7280]',
}

const statusLabels: Record<CapsuleStatus, string> = {
  SEALED: '封存中',
  FERMENTING: '发酵中',
  OPENED: '已开启',
  ARCHIVED: '已归档',
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
