import clsx from 'clsx'
import type { ReactNode } from 'react'

type BadgeVariant = 'amber' | 'success' | 'info' | 'danger' | 'premium'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

export default function Badge({ variant = 'amber', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variant === 'amber' && 'bg-amber/15 text-amber',
        variant === 'success' && 'bg-turf/15 text-turf',
        variant === 'info' && 'bg-smoke text-white/70',
        variant === 'danger' && 'bg-red-500/15 text-red-400',
        variant === 'premium' && 'bg-gradient-to-r from-amber/20 to-ember/20 text-amber',
        className
      )}
    >
      {children}
    </span>
  )
}
