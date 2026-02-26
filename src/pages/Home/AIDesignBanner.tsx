import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function AIDesignBanner() {
  return (
    <section className="bg-gradient-to-r from-primary-50 to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold text-accent">NEW</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-warm-900 mb-3">
              AI 인테리어 디자인
            </h2>
            <p className="text-warm-500 leading-relaxed mb-6 max-w-lg">
              방 사진 한 장으로 새로운 인테리어를 미리 확인하세요.
              AI가 구조를 유지한 채 원하는 스타일로 변환해 드립니다.
            </p>
            <Link to="/ai-design">
              <Button>
                AI 디자인 시작하기
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="w-full md:w-80 lg:w-96 aspect-[4/3] bg-gradient-to-br from-primary-100 to-accent/10 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <p className="text-sm font-medium text-warm-600">Before → After</p>
              <p className="text-xs text-warm-400">AI 인테리어 변환</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
