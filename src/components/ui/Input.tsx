import { cn } from '@/utils/cn';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-warm-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'w-full px-4 py-2.5 rounded-lg border border-warm-200 bg-white text-warm-800 placeholder:text-warm-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400',
          'transition-colors',
          error && 'border-red-400 focus:ring-red-300',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
