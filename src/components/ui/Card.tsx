import type { ComponentPropsWithoutRef, ElementType } from 'react'
import { cn } from '../../lib/cn'

const variantStyles = {
  default: 'border-slate-200 bg-white/95 shadow-sm',
  muted: 'border-slate-100 bg-slate-50/80',
  interactive:
    'border-slate-200 bg-white/95 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500',
}

const paddingStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

type CardProps<T extends ElementType = 'div'> = {
  as?: T
  variant?: keyof typeof variantStyles
  padding?: keyof typeof paddingStyles
  className?: string
} & ComponentPropsWithoutRef<T>

export function Card<T extends ElementType = 'div'>({
  as,
  variant = 'default',
  padding = 'md',
  className,
  ...props
}: CardProps<T>) {
  const Component = (as ?? 'div') as ElementType

  return (
    <Component
      className={cn(
        'rounded-2xl border backdrop-blur-sm transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
        variantStyles[variant],
        paddingStyles[padding],
        className,
      )}
      {...props}
    />
  )
}

