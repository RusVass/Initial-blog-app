import type {
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  ElementType,
  MouseEvent,
} from 'react'
import { cn } from '../../lib/cn'

interface VariantStyles {
  primary: string
  secondary: string
  outline: string
  danger: string
}

interface SizeStyles {
  sm: string
  md: string
  lg: string
}

type ButtonProps<T extends ElementType = 'button'> = {
  as?: T
  variant?: keyof VariantStyles
  size?: keyof SizeStyles
  className?: string
  disabled?: boolean
} & Omit<ComponentPropsWithoutRef<T>, 'disabled'>

const variantStyles: VariantStyles = {
  primary:
    'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-indigo-600',
  secondary:
    'bg-slate-900 text-white shadow-sm hover:bg-slate-800 focus-visible:outline-slate-900',
  outline:
    'border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-indigo-600',
  danger:
    'bg-rose-600 text-white shadow-sm hover:bg-rose-500 focus-visible:outline-rose-600',
}

const sizeStyles: SizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

const baseStyles =
  'inline-flex items-center justify-center rounded-xl font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

export function Button<T extends ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}: ButtonProps<T>) {
  const Component = (as ?? 'button') as ElementType

  const componentProps = {
    className: cn(baseStyles, variantStyles[variant], sizeStyles[size], className),
    ...props,
  } as ComponentPropsWithoutRef<T>

  if (Component === 'button') {
    const buttonProps = componentProps as ButtonHTMLAttributes<HTMLButtonElement>
    if (!buttonProps.type) {
      buttonProps.type = 'button'
    }
    if (disabled !== undefined) {
      buttonProps.disabled = disabled
    }
  } else if (disabled) {
    const elementProps = componentProps as Record<string, unknown>
    const originalOnClick = componentProps.onClick as
      | ((event: MouseEvent<HTMLElement>) => void)
      | undefined

    elementProps['aria-disabled'] = true
    elementProps['tabIndex'] = -1
    elementProps['onClick'] = (event: MouseEvent<HTMLElement>) => {
      event.preventDefault()
      if (originalOnClick) {
        originalOnClick(event)
      }
    }
  }

  return <Component {...componentProps} />
}

