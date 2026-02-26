import { Link, useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export function PaymentFailPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') ?? '';
  const message = searchParams.get('message') ?? '결제가 실패했습니다.';

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-16">
      <Card>
        <CardContent className="py-10 text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-warm-800 mb-2">결제 실패</h2>
          <p className="text-warm-600 mb-1">{message}</p>
          {code && <p className="text-xs text-warm-400 mb-6">오류 코드: {code}</p>}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/payment/checkout">
              <Button>다시 시도</Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline">요금제 보기</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
