import { Link } from 'react-router-dom';
import { MapPin, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import type { Supplier } from '@/types';

interface SupplierCardProps {
  supplier: Supplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  return (
    <Link to={`/suppliers/${supplier.id}`}>
      <Card hover>
        <CardContent>
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-accent" />
            </div>
            <Rating value={supplier.rating} size="sm" />
          </div>

          <h3 className="font-semibold text-warm-800 mb-1">{supplier.name}</h3>

          <div className="flex items-center gap-1 text-sm text-warm-500 mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>{supplier.location}</span>
            <span className="mx-1">·</span>
            <span>최소주문 {supplier.minOrderAmount}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {supplier.products.slice(0, 3).map((p) => (
              <Badge key={p}>{p}</Badge>
            ))}
            {supplier.products.length > 3 && (
              <Badge>+{supplier.products.length - 3}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
