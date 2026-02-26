import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md';
  showValue?: boolean;
  className?: string;
}

export function Rating({ value, max = 5, size = 'sm', showValue = true, className }: RatingProps) {
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {Array.from({ length: max }, (_, i) => (
          <Star
            key={i}
            className={cn(
              iconSize,
              i < Math.floor(value)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-warm-200 text-warm-200',
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-warm-600 ml-1">{value.toFixed(1)}</span>
      )}
    </div>
  );
}
