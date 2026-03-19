import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: number
  variant?: 'primary' | 'secondary'
  className?: string
}

export function StatsCard({
  label,
  value,
  variant = 'primary',
  className,
}: StatsCardProps) {
  const toneClass =
    variant === 'primary'
      ? 'border-indigo-400/30 bg-indigo-500/10 text-foreground'
      : 'border-pink-400/30 bg-pink-500/10 text-foreground'

  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 rounded-full border px-4 py-2 shadow-sm backdrop-blur-sm',
        toneClass,
        className,
      )}
    >
      <div className="text-lg font-semibold leading-none">{value}</div>
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
    </div>
  )
}
