import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-warm-800 text-warm-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">人</span>
              </div>
              <span className="text-xl font-bold text-white">
                직결<span className="text-accent-light">-</span>인
              </span>
            </div>
            <p className="text-sm text-warm-400 leading-relaxed">
              중개 수수료 없는 인테리어 직거래 플랫폼.<br />
              전문가와 고객을 직접 연결합니다.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-white transition-colors">구인구직</Link></li>
              <li><Link to="/companies" className="hover:text-white transition-colors">인테리어 업체</Link></li>
              <li><Link to="/suppliers" className="hover:text-white transition-colors">자재업체</Link></li>
              <li><Link to="/community" className="hover:text-white transition-colors">커뮤니티</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">요금제</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">등록하기</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs/new" className="hover:text-white transition-colors">구인구직 등록</Link></li>
              <li><Link to="/companies/register" className="hover:text-white transition-colors">업체 등록</Link></li>
              <li><Link to="/suppliers/register" className="hover:text-white transition-colors">자재업체 등록</Link></li>
              <li><Link to="/experts/register" className="hover:text-white transition-colors">전문가 등록</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">고객지원</h4>
            <ul className="space-y-2 text-sm">
              <li>이메일: support@jikgyeolin.kr</li>
              <li>전화: 02-1234-5678</li>
              <li>운영시간: 평일 09:00~18:00</li>
              <li className="pt-2 border-t border-warm-700">
                <Link to="/terms" className="hover:text-white transition-colors">이용약관</Link>
                <span className="mx-2 text-warm-600">|</span>
                <Link to="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-warm-700 text-center text-sm text-warm-500">
          © 2026 직결-인. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
