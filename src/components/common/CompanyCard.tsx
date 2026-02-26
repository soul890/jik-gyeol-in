import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { categories } from '@/data/categories';
import type { Company } from '@/types';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link to={`/companies/${company.id}`}>
      <Card hover>
        {company.portfolioImages && company.portfolioImages.length > 0 ? (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={company.portfolioImages[0]}
              alt={company.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-[16/9] bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
            <span className="text-primary-600 font-bold text-4xl">{company.name[0]}</span>
          </div>
        )}
        <CardContent>
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-warm-800">{company.name}</h3>
            <Rating value={company.rating} size="sm" />
          </div>

          <div className="flex items-center gap-1 text-sm text-warm-500 mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>{company.location}</span>
            <span className="mx-1">·</span>
            <span>경력 {company.experience}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {company.categories.slice(0, 4).map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              return cat ? (
                <Badge key={catId} variant="primary">{cat.name}</Badge>
              ) : null;
            })}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
