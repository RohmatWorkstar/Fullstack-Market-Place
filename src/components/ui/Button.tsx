'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500/50 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-0.5',
      secondary:
        'bg-surface-100 dark:bg-surface-900 text-surface-900 dark:text-surface-50 hover:bg-surface-200 dark:hover:bg-surface-800 focus:ring-surface-300 dark:focus:ring-surface-700 border border-surface-200/50 dark:border-surface-800',
      outline:
        'border-2 border-surface-200 dark:border-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-900 hover:border-primary-500/50 focus:ring-primary-500/30',
      ghost:
        'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-900 hover:text-surface-900 dark:hover:text-surface-100 focus:ring-surface-200 dark:focus:ring-surface-800',
      danger:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-7 py-3 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
