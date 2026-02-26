import { HandCoins, ShieldCheck, Search } from 'lucide-react';

const features = [
  {
    icon: HandCoins,
    title: '수수료 0원',
    description: '중개 수수료, 매칭비, 캐시 소진 없이 직접 연결됩니다.',
  },
  {
    icon: ShieldCheck,
    title: '검증된 전문가',
    description: '경력과 포트폴리오를 투명하게 확인할 수 있습니다.',
  },
  {
    icon: Search,
    title: '합리적 가격',
    description: '중개 마진 없는 직거래로 합리적인 견적을 받으세요.',
  },
];

export function FeatureHighlights() {
  return (
    <section className="bg-white border-y border-warm-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center">
                <f.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-bold text-warm-800">{f.title}</h3>
              <p className="text-sm text-warm-500 leading-relaxed max-w-xs">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
