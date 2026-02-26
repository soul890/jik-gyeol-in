import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = '결과가 없습니다',
  description = '검색 조건을 변경해보세요.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <SearchX className="w-12 h-12 text-warm-300 mb-4" />
      <h3 className="text-lg font-medium text-warm-600 mb-1">{title}</h3>
      <p className="text-sm text-warm-400">{description}</p>
    </div>
  );
}
