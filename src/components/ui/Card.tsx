import clsx from 'clsx'
import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean
  children: ReactNode
}

export default function Card({ glow, className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-graphite border border-smoke rounded-2xl p-6',
        'transition-all duration-200',
        glow && 'glow-amber border-amber/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
