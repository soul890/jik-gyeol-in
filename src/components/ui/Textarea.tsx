import { cn } from '@/utils/cn';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-warm-700">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          'w-full px-4 py-2.5 rounded-lg border border-warm-200 bg-white text-warm-800 placeholder:text-warm-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400',
          'transition-colors resize-y min-h-[100px]',
          error && 'border-red-400 focus:ring-red-300',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
