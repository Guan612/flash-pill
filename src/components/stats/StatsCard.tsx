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
  const gradientClass =
    variant === 'primary'
      ? 'bg-gradient-to-br from-indigo-500 to-pink-500'
      : 'bg-gradient-to-br from-purple-500 to-pink-500'

  return (
    <div className={cn('rounded-xl p-4 text-white', gradientClass, className)}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  )
}
