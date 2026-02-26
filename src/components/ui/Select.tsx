import { cn } from '@/utils/cn';
import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, id, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-warm-700">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          'w-full px-4 py-2.5 rounded-lg border border-warm-200 bg-white text-warm-800',
          'focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400',
          'transition-colors',
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
