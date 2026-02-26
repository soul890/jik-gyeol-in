import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section className="relative min-h-[480px] sm:min-h-[540px] lg:min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* 배경 이미지 (추후 교체) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/images/hero-bg.jpg)',
          backgroundColor: '#8B7355',
        }}
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
          인테리어 전문가를
          <br />
          <span className="text-accent">직접</span> 만나보세요.
        </h1>
        <p className="text-base sm:text-lg text-white/80 mb-8 max-w-xl mx-auto leading-relaxed">
          중개 수수료 없이 인테리어 전문가, 업체, 자재업체를 직접 연결합니다.
          <br className="hidden sm:block" />
          공정한 가격, 투명한 거래의 시작.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/jobs">
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white text-warm-800 border-white hover:bg-warm-100">
              구인구직 둘러보기
            </Button>
          </Link>
          <Link to="/companies">
            <Button size="lg" className="w-full sm:w-auto">
              업체 찾기
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
