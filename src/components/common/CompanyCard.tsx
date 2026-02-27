import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { categories } from '@/data/categories';
import type { Company } from '@/types';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const categoryNames = company.categories
    .slice(0, 3)
    .map((catId) => categories.find((c) => c.id === catId)?.name)
    .filter(Boolean)
    .join(', ');

  return (
    <Link to={`/companies/${company.id}`} className="group block">
      {/* 이미지 */}
      <div className="aspect-[4/3] overflow-hidden rounded-xl mb-3">
        {company.portfolioImages && company.portfolioImages.length > 0 ? (
          <img
            src={company.portfolioImages[0]}
            alt={company.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
            <span className="text-primary-600 font-bold text-4xl">{company.name[0]}</span>
          </div>
        )}
      </div>

      {/* 텍스트 */}
      <div className="flex items-center justify-between mb-0.5">
        <h3 className="font-semibold text-warm-800 truncate">{company.name}</h3>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <Star className="w-3.5 h-3.5 fill-warm-800 text-warm-800" />
          <span className="text-sm font-medium text-warm-800">{company.rating.toFixed(1)}</span>
        </div>
      </div>

      <p className="text-sm text-warm-500 mb-0.5">
        {company.location} · 경력 {company.experience}
      </p>

      {categoryNames && (
        <p className="text-sm text-warm-400">{categoryNames}</p>
      )}
    </Link>
  );
}
