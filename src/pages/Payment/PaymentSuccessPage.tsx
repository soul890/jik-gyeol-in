import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const { user, refreshProfile } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    if (!paymentKey || !orderId || !amount || !user) {
      setStatus('error');
      setErrorMsg('결제 정보가 올바르지 않습니다.');
      return;
    }

    const confirm = async () => {
      try {
        const idToken = await user.getIdToken();
        const res = await fetch('/api/payment-confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || '결제 승인에 실패했습니다.');
        }

        await refreshProfile();
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMsg(err instanceof Error ? err.message : '결제 처리 중 오류가 발생했습니다.');
      }
    };

    confirm();
  }, [paymentKey, orderId, amount, user, refreshProfile]);

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-16">
      <Card>
        <CardContent className="py-10 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
              <p className="text-warm-700 font-medium">결제를 확인하고 있습니다...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-warm-800 mb-2">결제 완료!</h2>
              <p className="text-warm-600 mb-6">
                Pro 구독이 활성화되었습니다. 이제 모든 Pro 기능을 이용하실 수 있습니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/ai-design">
                  <Button>
                    AI 디자인 사용하기
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline">홈으로</Button>
                </Link>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">!</span>
              </div>
              <h2 className="text-xl font-bold text-warm-800 mb-2">결제 확인 실패</h2>
              <p className="text-sm text-warm-500 mb-6">{errorMsg}</p>
              <Link to="/payment/checkout">
                <Button variant="outline">다시 시도</Button>
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
