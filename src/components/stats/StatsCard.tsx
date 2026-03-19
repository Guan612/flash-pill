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
      ? 'border-[#5BCEFA]/35 bg-[linear-gradient(135deg,rgba(91,206,250,0.18),rgba(255,255,255,0.96))] text-[#24455f]'
      : 'border-[#F5A9B8]/40 bg-[linear-gradient(135deg,rgba(245,169,184,0.22),rgba(255,255,255,0.96))] text-[#24455f]'

  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 rounded-full border px-4 py-2 shadow-[0_10px_24px_rgba(91,206,250,0.08)] backdrop-blur-sm',
        toneClass,
        className,
      )}
    >
      <div className="text-lg font-semibold leading-none">{value}</div>
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-[#5c7e98]">
        {label}
      </div>
    </div>
  )
}
