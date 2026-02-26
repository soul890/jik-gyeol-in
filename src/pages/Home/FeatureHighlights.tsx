import { HandCoins, Search, MessageSquare, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: HandCoins,
    title: '수수료 0원',
    description: '중개 수수료, 매칭비, 캐시 소진 없이 완전 무료로 이용하세요.',
  },
  {
    icon: Search,
    title: '공정별 전문가 검색',
    description: '13개 공정별로 원하는 전문가를 빠르게 찾을 수 있습니다.',
  },
  {
    icon: MessageSquare,
    title: '직접 소통',
    description: '중개인 없이 전문가와 직접 연락하고 조건을 조율하세요.',
  },
  {
    icon: ShieldCheck,
    title: '투명한 정보',
    description: '업체 정보, 포트폴리오, 리뷰를 투명하게 확인할 수 있습니다.',
  },
];

export function FeatureHighlights() {
  return (
    <section className="bg-white border-y border-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                <f.icon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-warm-800 mb-1">{f.title}</h3>
                <p className="text-sm text-warm-500 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
