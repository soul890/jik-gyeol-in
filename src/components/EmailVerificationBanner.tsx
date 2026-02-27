import { useState } from 'react';
import { Mail, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function EmailVerificationBanner() {
  const { user, resendVerification } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  // Google 로그인은 이미 인증됨, 미로그인이거나 이미 인증된 경우 표시 안함
  if (!user || user.emailVerified || dismissed) return null;

  const isGoogle = user.providerData.some((p) => p.providerId === 'google.com');
  if (isGoogle) return null;

  const handleResend = async () => {
    setSending(true);
    try {
      await resendVerification();
      setSent(true);
    } catch {
      // silently fail
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-amber-800 min-w-0">
          <Mail className="w-4 h-4 shrink-0" />
          <span className="truncate">
            {sent
              ? '인증 메일이 발송되었습니다. 메일함을 확인해주세요.'
              : '이메일 인증이 필요합니다. 메일함을 확인해주세요.'}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!sent && (
            <button
              onClick={handleResend}
              disabled={sending}
              className="text-xs font-medium text-amber-700 hover:text-amber-900 underline cursor-pointer disabled:opacity-50"
            >
              {sending ? '발송 중...' : '재발송'}
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-500 hover:text-amber-700 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
