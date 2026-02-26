import { cn } from '@/utils/cn';
import type { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning';
}

const variantStyles = {
  default: 'bg-warm-100 text-warm-600',
  primary: 'bg-primary-100 text-primary-700',
  accent: 'bg-orange-100 text-accent-dark',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-red-100 text-red-700',
};

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
