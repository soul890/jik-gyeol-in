import { Check, X, Sparkles, Building2, User, ArrowRight, Shield, Clock, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface PlanFeature {
  text: string;
  free: boolean;
  pro: boolean;
  business: boolean;
}

const features: PlanFeature[] = [
  { text: '프로필 등록 및 검색 노출', free: true, pro: true, business: true },
  { text: '연락처 공개 (전화/이메일)', free: true, pro: true, business: true },
  { text: '구인구직 글 등록', free: true, pro: true, business: true },
  { text: '커뮤니티 이용', free: true, pro: true, business: true },
  { text: '포트폴리오 사진 (최대 3장)', free: true, pro: true, business: true },
  { text: '검색 결과 상단 노출', free: false, pro: true, business: true },
  { text: '프로 인증 뱃지', free: false, pro: true, business: true },
  { text: '포트폴리오 사진 확장 (최대 20장)', free: false, pro: true, business: true },
  { text: '프로필 카드 강조 표시', free: false, pro: true, business: true },
  { text: '홈 화면 추천 업체 노출', free: false, pro: false, business: true },
  { text: '업체 공식 인증 마크 (사업자 인증)', free: false, pro: false, business: true },
  { text: '포트폴리오 사진 무제한', free: false, pro: false, business: true },
  { text: '커뮤니티 글 상단 고정 (월 2회)', free: false, pro: false, business: true },
];

const faqs = [
  {
    q: '무료 플랜으로도 충분히 이용할 수 있나요?',
    a: '네, 프로필 등록과 연락처 공개, 구인구직 글 등록, 커뮤니티 등 핵심 기능은 모두 무료입니다. 유료 플랜은 더 많은 노출과 신뢰도를 원하시는 분께 추천합니다.',
  },
  {
    q: '연락은 어떤 방식으로 이루어지나요?',
    a: '플랫폼이 연락을 중계하지 않습니다. 등록하신 전화번호나 이메일이 프로필에 공개되고, 고객이 직접 연락하는 방식입니다. 별도의 캐시 소진이나 건별 비용이 없습니다.',
  },
  {
    q: '결제 후 환불이 가능한가요?',
    a: '결제일로부터 7일 이내, 유료 기능 사용 이력이 없는 경우 전액 환불이 가능합니다. 약정 없이 언제든 해지할 수 있습니다.',
  },
  {
    q: '업체 인증 마크는 어떻게 받나요?',
    a: '비즈니스 플랜 가입 후 사업자등록증을 제출하시면 검토 후 인증 마크가 부여됩니다. 보통 1~2 영업일 내 처리됩니다.',
  },
  {
    q: '기존 플랫폼 대비 얼마나 절약되나요?',
    a: '기존 중개 플랫폼은 매칭 1건당 200~300만원, 견적 요청당 캐시 소진 등 건별 비용이 발생합니다. 직결-인은 월 정액제로 건별 수수료가 전혀 없어, 월 1건만 성사되어도 수백만원을 절약할 수 있습니다.',
  },
];

export function PricingPage() {
  const navigate = useNavigate();

  const handleSelect = (plan: string) => {
    if (plan === '무료') {
      navigate('/signup');
    } else if (plan === '비즈니스') {
      navigate('/payment/checkout?plan=business');
    } else {
      navigate('/payment/checkout?plan=pro');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <Badge variant="accent" className="mb-4">중개 수수료 0원</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-900 mb-4 leading-tight">
            합리적인 요금,<br />
            <span className="text-accent">확실한 가치</span>
          </h1>
          <p className="text-lg text-warm-500 max-w-2xl mx-auto leading-relaxed">
            건별 중개 수수료 없이 월 정액으로 이용하세요.<br />
            기존 플랫폼 매칭비 200~300만원 vs 직결-인 월 최대 49,900원
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-b border-warm-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-lg font-bold text-warm-800 text-center mb-8">직결-인은 이렇게 다릅니다</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-accent mb-2">1</div>
              <p className="font-semibold text-warm-800 mb-1">프로필 등록</p>
              <p className="text-sm text-warm-500">내 정보와 연락처를 등록하면<br />고객이 직접 검색할 수 있습니다</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-accent mb-2">2</div>
              <p className="font-semibold text-warm-800 mb-1">고객이 직접 연락</p>
              <p className="text-sm text-warm-500">중개 없이 고객이 공개된<br />전화번호/이메일로 직접 연락합니다</p>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-accent mb-2">3</div>
              <p className="font-semibold text-warm-800 mb-1">건별 비용 0원</p>
              <p className="text-sm text-warm-500">몇 건을 수주하든 추가 비용 없음<br />월 정액 요금만 내면 끝</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* 무료 플랜 */}
          <Card className="relative p-6 sm:p-8 flex flex-col">
            <div className="mb-6">
              <div className="w-12 h-12 bg-warm-100 rounded-xl flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-warm-500" />
              </div>
              <h3 className="text-xl font-bold text-warm-800 mb-1">무료</h3>
              <p className="text-sm text-warm-500">처음 시작하는 분께 추천</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-warm-800">0</span>
                <span className="text-warm-500">원/월</span>
              </div>
              <p className="text-xs text-warm-400 mt-1">영원히 무료</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {features.filter((f) => f.free).map((f) => (
                <li key={f.text} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-warm-700">{f.text}</span>
                </li>
              ))}
              {features.filter((f) => !f.free).slice(0, 3).map((f) => (
                <li key={f.text} className="flex items-start gap-2 text-sm">
                  <X className="w-4 h-4 text-warm-300 mt-0.5 shrink-0" />
                  <span className="text-warm-400">{f.text}</span>
                </li>
              ))}
            </ul>

            <Button variant="outline" className="w-full" onClick={() => handleSelect('무료')}>
              무료로 시작하기
            </Button>
          </Card>

          {/* 프로 플랜 */}
          <Card className="relative p-6 sm:p-8 flex flex-col border-2 border-primary-400 shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="accent" className="px-4 py-1 text-sm shadow-sm">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                인기
              </Badge>
            </div>

            <div className="mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-warm-800 mb-1">프로</h3>
              <p className="text-sm text-warm-500">공정별 개인 전문가용</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary-600">19,900</span>
                <span className="text-warm-500">원/월</span>
              </div>
              <p className="text-xs text-warm-400 mt-1">연 결제 시 월 15,900원</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {features.filter((f) => f.pro).map((f) => (
                <li key={f.text} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-warm-700">{f.text}</span>
                </li>
              ))}
              {features.filter((f) => !f.pro).slice(0, 2).map((f) => (
                <li key={f.text} className="flex items-start gap-2 text-sm">
                  <X className="w-4 h-4 text-warm-300 mt-0.5 shrink-0" />
                  <span className="text-warm-400">{f.text}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full" onClick={() => handleSelect('프로')}>
              프로 시작하기
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>

          {/* 비즈니스 플랜 */}
          <Card className="relative p-6 sm:p-8 flex flex-col">
            <div className="mb-6">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-warm-800 mb-1">비즈니스</h3>
              <p className="text-sm text-warm-500">인테리어 업체용</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-warm-800">49,900</span>
                <span className="text-warm-500">원/월</span>
              </div>
              <p className="text-xs text-warm-400 mt-1">연 결제 시 월 39,900원</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {features.filter((f) => f.business).map((f) => (
                <li key={f.text} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-warm-700">{f.text}</span>
                </li>
              ))}
            </ul>

            <Button variant="secondary" className="w-full" onClick={() => handleSelect('비즈니스')}>
              비즈니스 시작하기
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        </div>
      </section>

      {/* 비교 절약 섹션 */}
      <section className="bg-white border-y border-warm-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-warm-800 text-center mb-10">기존 플랫폼 대비 절약 효과</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">

            <div className="p-6 bg-red-50 rounded-2xl border border-red-200">
              <p className="text-sm font-medium text-red-600 mb-4">기존 중개 플랫폼</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-warm-600">매칭비 (건당)</span>
                  <span className="font-bold text-red-600">200~300만원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-warm-600">견적 캐시 (건당)</span>
                  <span className="font-bold text-red-600">3~5만원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-warm-600">월 10건 견적 시</span>
                  <span className="font-bold text-red-600">30~50만원+</span>
                </div>
                <div className="pt-3 border-t border-red-200 flex justify-between items-center">
                  <span className="text-sm font-medium text-warm-700">월 예상 비용</span>
                  <span className="text-lg font-bold text-red-600">수십~수백만원</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
              <p className="text-sm font-medium text-emerald-600 mb-4">직결-인</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-warm-600">매칭 수수료</span>
                  <span className="font-bold text-emerald-600">0원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-warm-600">견적 캐시</span>
                  <span className="font-bold text-emerald-600">0원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-warm-600">건별 추가 비용</span>
                  <span className="font-bold text-emerald-600">0원</span>
                </div>
                <div className="pt-3 border-t border-emerald-200 flex justify-between items-center">
                  <span className="text-sm font-medium text-warm-700">월 정액</span>
                  <span className="text-lg font-bold text-emerald-600">최대 49,900원</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-warm-500 mt-8">
            월 1건만 성사되어도 <span className="font-bold text-accent">최소 150만원 이상</span> 절약됩니다.
          </p>
        </div>
      </section>

      {/* 신뢰 포인트 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-primary-600" />
            </div>
            <h3 className="font-semibold text-warm-800 mb-2">숨겨진 비용 없음</h3>
            <p className="text-sm text-warm-500">표시된 월 요금이 전부입니다. 건별 수수료, 캐시 소진 일절 없음.</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-7 h-7 text-primary-600" />
            </div>
            <h3 className="font-semibold text-warm-800 mb-2">약정 없이 언제든 해지</h3>
            <p className="text-sm text-warm-500">마음에 안 들면 바로 해지. 남은 기간은 일할 환불됩니다.</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-7 h-7 text-primary-600" />
            </div>
            <h3 className="font-semibold text-warm-800 mb-2">무료로 먼저 체험</h3>
            <p className="text-sm text-warm-500">결제 없이 무료 플랜으로 시작하고, 효과를 확인한 후 업그레이드하세요.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-y border-warm-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-warm-800 text-center mb-10">자주 묻는 질문</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="p-5 bg-warm-50 rounded-xl">
                <h4 className="font-semibold text-warm-800 mb-2">{faq.q}</h4>
                <p className="text-sm text-warm-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-warm-800 mb-4">
          지금 바로 시작하세요
        </h2>
        <p className="text-warm-500 mb-8 max-w-lg mx-auto">
          무료 플랜으로 부담 없이 시작하고,<br />
          효과를 확인한 후 업그레이드하세요.
        </p>
        <Button size="lg" onClick={() => handleSelect('무료')}>
          무료로 시작하기
          <ArrowRight className="w-5 h-5" />
        </Button>
      </section>

    </div>
  );
}
