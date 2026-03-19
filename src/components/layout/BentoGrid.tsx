import type { ReactNode } from 'react'

interface BentoGridProps {
  children: ReactNode
  className?: string
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div
      className={`grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 min-[1440px]:grid-cols-4 ${className}`}
    >
      {children}
    </div>
  )
}
