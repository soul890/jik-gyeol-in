import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function AIDesignBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="relative rounded-2xl overflow-hidden">
        {/* 배경 이미지 (추후 교체) */}
        <div
          className="relative w-full aspect-[21/9] sm:aspect-[21/8] bg-cover bg-center"
          style={{
            backgroundImage: 'url(/images/ai-banner-bg.jpg)',
            backgroundColor: '#A89279',
          }}
        >
          <div className="absolute inset-0 bg-black/20" />

          {/* Before / After 라벨 */}
          <span className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 text-warm-800 text-xs font-semibold rounded-md">
            Before
          </span>
          <span className="absolute bottom-4 right-4 px-3 py-1 bg-white/90 text-warm-800 text-xs font-semibold rounded-md">
            After
          </span>

          {/* 중앙 오버레이 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 text-center shadow-lg">
              <div className="w-10 h-10 bg-warm-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <p className="font-semibold text-warm-800 text-sm sm:text-base">내 공간을 미리 확인하세요.</p>
              <p className="text-xs sm:text-sm text-warm-500">AI 인테리어 디자인 체험하기</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-5">
        <Link to="/ai-design">
          <Button className="rounded-full px-6">
            <Sparkles className="w-4 h-4" />
            AI 기능 살펴보기
          </Button>
        </Link>
      </div>
    </section>
  );
}
