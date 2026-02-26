import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, Package, Truck, Banknote } from 'lucide-react';
import { suppliers } from '@/data/suppliers';
import { categories } from '@/data/categories';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Rating } from '@/components/ui/Rating';

export function SupplierDetailPage() {
  const { id } = useParams();
  const supplier = suppliers.find((s) => s.id === id);

  if (!supplier) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-warm-700 mb-4">업체를 찾을 수 없습니다</h2>
        <Link to="/suppliers">
          <Button variant="outline">목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/suppliers" className="inline-flex items-center gap-1 text-sm text-warm-500 hover:text-warm-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        목록으로
      </Link>

      <Card>
        <CardContent className="py-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
              <Package className="w-8 h-8 text-accent" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-warm-800 mb-1">{supplier.name}</h1>
              <Rating value={supplier.rating} size="md" />
              <p className="text-sm text-warm-400 mt-1">리뷰 {supplier.reviewCount}개</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {supplier.categories.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              return cat ? <Badge key={catId} variant="primary">{cat.name}</Badge> : null;
            })}
          </div>

          <p className="text-warm-700 leading-relaxed mb-6">{supplier.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-warm-50 rounded-xl">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-warm-400" />
              <div>
                <p className="text-xs text-warm-400">위치</p>
                <p className="text-sm font-medium text-warm-700">{supplier.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Banknote className="w-4 h-4 text-warm-400" />
              <div>
                <p className="text-xs text-warm-400">최소 주문</p>
                <p className="text-sm font-medium text-warm-700">{supplier.minOrderAmount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-warm-400" />
              <div>
                <p className="text-xs text-warm-400">배송</p>
                <p className="text-sm font-medium text-warm-700">{supplier.deliveryInfo}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-warm-800 mb-3">취급 제품</h3>
            <div className="flex flex-wrap gap-2">
              {supplier.products.map((product) => (
                <Badge key={product} variant="default">{product}</Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-warm-200">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary-500" />
              <span className="text-sm text-warm-700">{supplier.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary-500" />
              <span className="text-sm text-warm-700">{supplier.contact}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
