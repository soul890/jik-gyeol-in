import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  linkTo?: string;
  linkText?: string;
}

export function SectionHeader({ title, subtitle, linkTo, linkText = '더보기' }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-warm-800">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-warm-500">{subtitle}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="flex items-center gap-0.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          {linkText}
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
