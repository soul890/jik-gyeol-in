import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 rounded-full mb-6">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary-700">중개 수수료 0원</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-warm-900 leading-tight mb-6">
            인테리어 전문가를
            <br />
            <span className="text-accent">직접</span> 만나보세요
          </h1>

          <p className="text-lg sm:text-xl text-warm-500 mb-8 max-w-2xl leading-relaxed">
            중개 수수료 없이 인테리어 전문가, 업체, 자재업체를 직접 연결합니다.
            <br className="hidden sm:block" />
            공정한 가격, 투명한 거래의 시작.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/jobs">
              <Button size="lg" className="w-full sm:w-auto">
                구인구직 둘러보기
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/companies">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                업체 찾기
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-warm-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-warm-800">수수료 0원</p>
                <p className="text-xs text-warm-400">완전 무료 연결</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-warm-800">검증된 전문가</p>
                <p className="text-xs text-warm-400">경력 인증 시스템</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Banknote className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-warm-800">합리적 가격</p>
                <p className="text-xs text-warm-400">직거래 최저가</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
