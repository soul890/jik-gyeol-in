import { Link } from 'react-router-dom';
import { Users, Zap, Shield, Heart, Target, TrendingUp, Building2, Handshake } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { usePageTitle } from '@/hooks/usePageTitle';

const values = [
  {
    icon: Zap,
    title: '수수료 제로',
    desc: '중개 수수료 없이 인테리어 전문가와 고객을 직접 연결합니다. 불필요한 비용을 줄이고 합리적인 가격으로 시공할 수 있습니다.',
  },
  {
    icon: Shield,
    title: '신뢰와 투명성',
    desc: '실제 시공 후기, 포트폴리오, 검증된 업체 정보를 제공하여 고객이 안심하고 업체를 선택할 수 있는 환경을 만듭니다.',
  },
  {
    icon: Handshake,
    title: '공정한 거래',
    desc: '인테리어 업계의 불투명한 가격 구조를 개선하고, 전문가와 고객 모두에게 공정한 거래 환경을 제공합니다.',
  },
  {
    icon: Heart,
    title: '커뮤니티 중심',
    desc: '시공 노하우, 질문과 답변, 자유로운 정보 공유를 통해 인테리어 업계 종사자와 고객이 함께 성장하는 커뮤니티를 지향합니다.',
  },
];

const stats = [
  { icon: Building2, label: '등록 업체', value: '500+' },
  { icon: Users, label: '가입 회원', value: '2,000+' },
  { icon: Target, label: '구인구직 공고', value: '1,200+' },
  { icon: TrendingUp, label: '월 방문자', value: '10,000+' },
];

const milestones = [
  { year: '2025.06', title: '서비스 기획 시작', desc: '인테리어 업계의 비효율적인 구조를 개선하기 위한 플랫폼 기획' },
  { year: '2025.09', title: '베타 서비스 출시', desc: '구인구직, 업체 등록, 커뮤니티 기능을 갖춘 베타 버전 런칭' },
  { year: '2025.12', title: 'AI 디자인 기능 추가', desc: 'AI 기반 인테리어 디자인 시뮬레이션 기능 도입' },
  { year: '2026.02', title: '정식 서비스 오픈', desc: '채팅, 결제, Pro 구독 등 풀 기능 서비스 정식 출시' },
];

export function AboutPage() {
  usePageTitle('회사소개');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* 히어로 */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium mb-6">
          <Users className="w-4 h-4" />
          직결-인 소개
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-warm-800 mb-4">
          중개 수수료 없는<br />
          인테리어 직거래 플랫폼
        </h1>
        <p className="text-lg text-warm-500 max-w-2xl mx-auto leading-relaxed">
          직결-인은 인테리어 업체, 자재업체, 시공 전문가와 고객을 직접 연결하는 플랫폼입니다.
          불필요한 중개 과정을 없애고, 투명하고 공정한 인테리어 시장을 만들어 갑니다.
        </p>
      </section>

      {/* 미션 */}
      <section className="mb-16">
        <Card>
          <CardContent className="py-8 px-6 sm:px-10">
            <h2 className="text-xl font-bold text-warm-800 mb-3">우리의 미션</h2>
            <p className="text-warm-600 leading-relaxed text-lg">
              "인테리어 업계의 정보 비대칭과 불합리한 수수료 구조를 혁신하여,
              전문가는 정당한 대가를 받고 고객은 합리적인 비용으로 만족스러운 시공을 경험하는 세상을 만듭니다."
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 핵심 가치 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-warm-800 mb-6 text-center">핵심 가치</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map((v) => (
            <Card key={v.title}>
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                    <v.icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-warm-800 mb-1">{v.title}</h3>
                    <p className="text-sm text-warm-500 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 서비스 현황 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-warm-800 mb-6 text-center">서비스 현황</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="py-6 text-center">
                <s.icon className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-warm-800">{s.value}</p>
                <p className="text-xs text-warm-500 mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 연혁 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-warm-800 mb-6 text-center">서비스 연혁</h2>
        <div className="space-y-4">
          {milestones.map((m, i) => (
            <div key={i} className="flex gap-4">
              <div className="shrink-0 w-20 text-sm font-bold text-primary-500 pt-1">{m.year}</div>
              <div className="flex-1 pb-4 border-b border-warm-100 last:border-0">
                <p className="font-semibold text-warm-800">{m.title}</p>
                <p className="text-sm text-warm-500 mt-0.5">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 제공 서비스 안내 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-warm-800 mb-6 text-center">주요 서비스</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="py-6">
              <h3 className="font-bold text-warm-800 mb-2">구인구직</h3>
              <p className="text-sm text-warm-500 leading-relaxed">
                인테리어 현장 인력과 업체를 연결합니다. 타일, 목공, 도배, 페인트, 전기, 설비 등
                전 분야의 구인구직 정보를 무료로 등록하고 검색할 수 있습니다.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <h3 className="font-bold text-warm-800 mb-2">인테리어 업체 등록</h3>
              <p className="text-sm text-warm-500 leading-relaxed">
                포트폴리오와 시공 후기를 기반으로 검증된 업체를 찾을 수 있습니다.
                업체는 무료로 프로필을 등록하고 고객에게 직접 홍보할 수 있습니다.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <h3 className="font-bold text-warm-800 mb-2">자재업체 검색</h3>
              <p className="text-sm text-warm-500 leading-relaxed">
                타일, 마루, 벽지, 조명 등 다양한 자재업체를 한 곳에서 검색하고 비교할 수 있습니다.
                중간 유통 없이 합리적인 가격에 자재를 구매하세요.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <h3 className="font-bold text-warm-800 mb-2">AI 인테리어 디자인</h3>
              <p className="text-sm text-warm-500 leading-relaxed">
                AI 기술을 활용하여 인테리어 디자인 시뮬레이션을 제공합니다.
                시공 전 결과물을 미리 확인하고 최적의 디자인을 선택하세요.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-primary-50 rounded-2xl py-10 px-6">
        <h2 className="text-xl font-bold text-warm-800 mb-2">직결-인과 함께 시작하세요</h2>
        <p className="text-warm-500 mb-6">무료로 가입하고 인테리어 직거래의 새로운 경험을 만나보세요.</p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/signup"
            className="px-6 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            무료 회원가입
          </Link>
          <Link
            to="/contact"
            className="px-6 py-2.5 border border-warm-300 text-warm-700 rounded-lg font-medium hover:bg-warm-100 transition-colors"
          >
            문의하기
          </Link>
        </div>
      </section>
    </div>
  );
}
