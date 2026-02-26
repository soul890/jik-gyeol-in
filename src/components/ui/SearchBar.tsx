import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { InputHTMLAttributes } from 'react';

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void;
}

export function SearchBar({ className, onSearch, onChange, ...props }: SearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400" />
      <input
        type="text"
        className="w-full pl-11 pr-4 py-3 rounded-xl border border-warm-200 bg-white text-warm-800 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-colors"
        onChange={(e) => {
          onChange?.(e);
          onSearch?.(e.target.value);
        }}
        {...props}
      />
    </div>
  );
}
