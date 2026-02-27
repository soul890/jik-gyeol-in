import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

const COOKIE_KEY = 'cookie_consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-warm-200 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
            <Cookie className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-warm-700 leading-relaxed">
              직결-인은 원활한 서비스 제공과 사용자 경험 향상을 위해 쿠키를 사용합니다.
              사이트를 계속 이용하시면 쿠키 사용에 동의하는 것으로 간주됩니다.
              자세한 내용은{' '}
              <Link to="/privacy" className="text-primary-500 hover:underline font-medium">
                개인정보처리방침
              </Link>
              을 참고해 주세요.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={accept}
                className="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
              >
                동의합니다
              </button>
              <button
                onClick={accept}
                className="px-4 py-2 text-sm text-warm-500 hover:text-warm-700 transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
