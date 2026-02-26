import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, Building2, Check, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { getTossPayments } from '@/lib/toss';

const plans = {
  pro: {
    name: 'Pro',
    label: 'Pro 플랜',
    amount: 19900,
    amountLabel: '19,900원',
    orderPrefix: 'PRO',
    orderName: '직결-인 Pro 월간 구독',
    icon: Sparkles,
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
    benefits: [
      'AI 인테리어 디자인 무제한 사용',
      '포트폴리오 사진 최대 20장',
      '검색 결과 상단 노출',
      '프로 인증 뱃지',
      '프로필 카드 강조 표시',
    ],
  },
  business: {
    name: 'Business',
    label: '비즈니스 플랜',
    amount: 49900,
    amountLabel: '49,900원',
    orderPrefix: 'BIZ',
    orderName: '직결-인 Business 월간 구독',
    icon: Building2,
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    benefits: [
      'AI 인테리어 디자인 무제한 사용',
      '포트폴리오 사진 무제한',
      '검색 결과 상단 노출',
      '프로 인증 뱃지',
      '프로필 카드 강조 표시',
      '홈 화면 추천 업체 노출',
      '업체 공식 인증 마크 (사업자 인증)',
      '커뮤니티 글 상단 고정 (월 2회)',
    ],
  },
} as const;

type PlanKey = keyof typeof plans;

export function CheckoutPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(false);

  const planKey = (searchParams.get('plan') === 'business' ? 'business' : 'pro') as PlanKey;
  const plan = plans[planKey];
  const Icon = plan.icon;

  const handlePayment = async () => {
    if (!user) return;
    setProcessing(true);

    try {
      const toss = await getTossPayments();
      const payment = toss.payment({ customerKey: user.uid });

      const orderId = `${plan.orderPrefix}-${user.uid.slice(0, 8)}-${Date.now()}`;

      await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: plan.amount },
        orderId,
        orderName: plan.orderName,
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
            <div className={`w-12 h-12 ${plan.iconBg} rounded-xl flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${plan.iconColor}`} />
            </div>
            <div>
              <p className="font-semibold text-warm-800 text-lg">{plan.label}</p>
              <p className="text-sm text-warm-500">월간 구독</p>
            </div>
          </div>

          <ul className="space-y-2">
            {plan.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                <span className="text-warm-700">{b}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-warm-200 pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-warm-600">결제 금액</span>
              <span className="text-2xl font-bold text-warm-800">{plan.amountLabel}</span>
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
