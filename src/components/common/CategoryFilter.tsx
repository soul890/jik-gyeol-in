import { cn } from '@/utils/cn';
import { categories } from '@/data/categories';
import type { Category } from '@/types';

interface CategoryFilterProps {
  selected: string;
  onChange: (id: string) => void;
  className?: string;
  items?: Category[];
}

export function CategoryFilter({ selected, onChange, className, items }: CategoryFilterProps) {
  const list = items ?? categories;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <button
        onClick={() => onChange('all')}
        className={cn(
          'px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer',
          selected === 'all'
            ? 'bg-primary-500 text-white'
            : 'bg-warm-100 text-warm-600 hover:bg-warm-200',
        )}
      >
        전체
      </button>
      {list.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer',
            selected === cat.id
              ? 'bg-primary-500 text-white'
              : 'bg-warm-100 text-warm-600 hover:bg-warm-200',
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
