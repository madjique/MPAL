import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all duration-200 active:scale-95',
          {
            primary: 'bg-primary text-white shadow-sm hover:brightness-110',
            secondary: 'bg-white/60 dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-white/50 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/15',
            ghost: 'text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/10',
            danger: 'bg-red-500 text-white shadow-sm hover:brightness-110',
          }[variant],
          {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-5 py-2.5 text-sm',
            lg: 'px-6 py-3 text-base',
          }[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
