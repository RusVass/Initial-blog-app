import { forwardRef } from 'react'
import type { ForwardedRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type BaseProps = InputHTMLAttributes<HTMLInputElement> & {
  as?: 'input'
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  as: 'textarea'
}

export type InputProps = BaseProps | TextareaProps

const inputStyles =
  'w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 shadow-sm transition focus-visible:border-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-60'

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(function Input(
  { as = 'input', className, ...props },
  ref,
) {
  if (as === 'textarea') {
    return (
      <textarea
        ref={ref as ForwardedRef<HTMLTextAreaElement>}
        className={cn(inputStyles, 'min-h-[10rem]', className)}
        {...props}
      />
    )
  }

  return <input ref={ref as ForwardedRef<HTMLInputElement>} className={cn(inputStyles, className)} {...props} />
})

