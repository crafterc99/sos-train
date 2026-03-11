import clsx from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-bold tracking-tight transition-all duration-200 cursor-pointer select-none',
        // Size — Button/CTA: Inter Bold, 14-16px, weight 700
        size === 'sm' && 'rounded-lg px-4 py-2 text-sm min-h-[36px]',
        size === 'md' && 'rounded-xl px-6 py-3 text-sm min-h-[44px]',
        size === 'lg' && 'rounded-xl px-8 py-4 text-base min-h-[52px]',
        // PRIMARY: Fire Surge gradient (#FFA500 → #CC6E00)
        variant === 'primary' && [
          'text-white',
          'bg-gradient-to-r from-amber to-ember',
          'shadow-[0_2px_12px_rgba(255,165,0,0.35)]',
          'hover:shadow-[0_4px_20px_rgba(255,165,0,0.5)]',
          'hover:from-blaze hover:to-ember',
          'active:scale-[0.98]',
        ],
        // SECONDARY: Deep Graphite card style
        variant === 'secondary' && [
          'bg-graphite text-white border border-smoke',
          'hover:border-amber hover:text-amber',
          'active:scale-[0.98]',
        ],
        // GHOST: Subtle
        variant === 'ghost' && 'text-white/60 hover:text-white hover:bg-smoke/50 active:scale-[0.98]',
        // DANGER: Red
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
        // OUTLINE: Amber border
        variant === 'outline' && [
          'border-2 border-amber text-amber bg-transparent',
          'hover:bg-amber hover:text-charcoal',
          'active:scale-[0.98]',
        ],
        (disabled || loading) && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  )
}
