import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-warm-300 mb-4">404</h1>
      <h2 className="text-xl font-semibold text-warm-700 mb-2">페이지를 찾을 수 없습니다</h2>
      <p className="text-warm-500 mb-8">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      <Link to="/">
        <Button>
          <Home className="w-4 h-4 mr-1" />
          홈으로 돌아가기
        </Button>
      </Link>
    </div>
  );
}
