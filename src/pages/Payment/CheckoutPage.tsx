import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Check, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { getTossPayments } from '@/lib/toss';

const proBenefits = [
  'AI 인테리어 디자인 무제한 사용',
  '포트폴리오 사진 최대 20장',
  '검색 결과 상단 노출',
  '프로 인증 뱃지',
  '프로필 카드 강조 표시',
];

export function CheckoutPage() {
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (!user) return;
    setProcessing(true);

    try {
      const toss = await getTossPayments();
      const payment = toss.payment({ customerKey: user.uid });

      const orderId = `PRO-${user.uid.slice(0, 8)}-${Date.now()}`;

      await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: 19900 },
        orderId,
        orderName: '직결-인 Pro 월간 구독',
        customerEmail: user.email ?? undefined,
        customerName: user.displayName ?? undefined,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes('USER_CANCEL')) {
        // user cancelled - no action needed
      } else {
        console.error('Payment request error:', err);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
      <Link to="/pricing" className="inline-flex items-center gap-1 text-sm text-warm-500 hover:text-warm-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        요금제 보기
      </Link>

      <h1 className="text-2xl font-bold text-warm-800 mb-6">구독 결제</h1>

      <Card>
        <CardContent className="py-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-warm-800 text-lg">Pro 플랜</p>
              <p className="text-sm text-warm-500">월간 구독</p>
            </div>
          </div>

          <ul className="space-y-2">
            {proBenefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                <span className="text-warm-700">{b}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-warm-200 pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-warm-600">결제 금액</span>
              <span className="text-2xl font-bold text-warm-800">19,900원</span>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handlePayment}
              disabled={processing || !user}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  결제하기
                </>
              )}
            </Button>

            {!user && (
              <p className="text-sm text-red-500 mt-2 text-center">
                로그인 후 결제가 가능합니다.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
