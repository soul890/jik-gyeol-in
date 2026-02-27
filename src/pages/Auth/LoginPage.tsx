import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { auth, db } from '@/lib/firebase';

export function LoginPage() {
  usePageTitle('로그인');
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 아이디 찾기
  const [findIdOpen, setFindIdOpen] = useState(false);
  const [findIdMethod, setFindIdMethod] = useState<'nickname' | 'phone'>('nickname');
  const [findIdValue, setFindIdValue] = useState('');
  const [findIdResult, setFindIdResult] = useState<string | null>(null);
  const [findIdLoading, setFindIdLoading] = useState(false);
  const [findIdError, setFindIdError] = useState('');

  // 비밀번호 찾기
  const [resetPwOpen, setResetPwOpen] = useState(false);
  const [resetPwEmail, setResetPwEmail] = useState('');
  const [resetPwSent, setResetPwSent] = useState(false);
  const [resetPwLoading, setResetPwLoading] = useState(false);
  const [resetPwError, setResetPwError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/invalid-email') {
        setError('유효하지 않은 이메일 형식입니다.');
      } else if (code === 'auth/invalid-credential') {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (code === 'auth/too-many-requests') {
        setError('로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError('로그인에 실패했습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch {
      setError('Google 로그인에 실패했습니다.');
    }
  };

  const handleFindId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!findIdValue.trim()) return;
    setFindIdError('');
    setFindIdResult(null);
    setFindIdLoading(true);
    try {
      const field = findIdMethod === 'nickname' ? 'nickname' : 'phone';
      const snap = await getDocs(
        query(collection(db, 'users'), where(field, '==', findIdValue.trim())),
      );
      if (snap.empty) {
        setFindIdError(
          findIdMethod === 'nickname'
            ? '해당 닉네임으로 등록된 계정을 찾을 수 없습니다.'
            : '해당 휴대폰 번호로 등록된 계정을 찾을 수 없습니다.',
        );
      } else {
        const userData = snap.docs[0].data();
        const foundEmail = userData.email as string;
        const [local, domain] = foundEmail.split('@');
        const masked = local[0] + '*'.repeat(Math.max(local.length - 1, 1)) + '@' + domain;
        setFindIdResult(masked);
      }
    } catch {
      setFindIdError('검색 중 오류가 발생했습니다.');
    } finally {
      setFindIdLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPwEmail.trim()) return;
    setResetPwError('');
    setResetPwLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetPwEmail.trim());
      setResetPwSent(true);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/invalid-email') {
        setResetPwError('유효하지 않은 이메일 형식입니다.');
      } else if (code === 'auth/user-not-found') {
        setResetPwError('해당 이메일로 등록된 계정이 없습니다.');
      } else {
        setResetPwError('이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setResetPwLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-warm-800 text-center mb-8">로그인</h1>
      <Card>
        <CardContent className="py-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}
            <Input
              id="email"
              label="이메일"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          {/* 아이디/비밀번호 찾기 */}
          <div className="flex items-center justify-center gap-3 mt-4 text-sm">
            <button
              type="button"
              onClick={() => { setFindIdOpen(true); setFindIdValue(''); setFindIdResult(null); setFindIdError(''); setFindIdMethod('nickname'); }}
              className="text-warm-500 hover:text-warm-700 transition-colors cursor-pointer"
            >
              아이디 찾기
            </button>
            <span className="text-warm-300">|</span>
            <button
              type="button"
              onClick={() => { setResetPwOpen(true); setResetPwEmail(''); setResetPwSent(false); setResetPwError(''); }}
              className="text-warm-500 hover:text-warm-700 transition-colors cursor-pointer"
            >
              비밀번호 찾기
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-warm-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-warm-400">또는</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-warm-300 rounded-lg text-sm font-medium text-warm-700 hover:bg-warm-50 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google로 로그인
          </button>

          <p className="mt-4 text-center text-sm text-warm-500">
            계정이 없으신가요?{' '}
            <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
              회원가입
            </Link>
          </p>
        </CardContent>
      </Card>

      {/* 아이디 찾기 모달 */}
      <Modal isOpen={findIdOpen} onClose={() => setFindIdOpen(false)} title="아이디 찾기">
        <form onSubmit={handleFindId} className="space-y-4">
          <p className="text-sm text-warm-500">
            닉네임 또는 휴대폰 번호로 가입된 이메일을 찾을 수 있습니다.
          </p>
          {/* 검색 방법 선택 */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setFindIdMethod('nickname'); setFindIdValue(''); setFindIdError(''); setFindIdResult(null); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors cursor-pointer ${findIdMethod === 'nickname' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-warm-600 border-warm-300 hover:bg-warm-50'}`}
            >
              닉네임으로 찾기
            </button>
            <button
              type="button"
              onClick={() => { setFindIdMethod('phone'); setFindIdValue(''); setFindIdError(''); setFindIdResult(null); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors cursor-pointer ${findIdMethod === 'phone' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-warm-600 border-warm-300 hover:bg-warm-50'}`}
            >
              휴대폰으로 찾기
            </button>
          </div>
          {findIdError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
              {findIdError}
            </div>
          )}
          {findIdResult ? (
            <>
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-4 text-center">
                <p className="mb-1">등록된 이메일을 찾았습니다.</p>
                <p className="text-lg font-bold">{findIdResult}</p>
              </div>
              <Button
                type="button"
                className="w-full"
                onClick={() => setFindIdOpen(false)}
              >
                로그인으로 돌아가기
              </Button>
            </>
          ) : (
            <>
              {findIdMethod === 'nickname' ? (
                <Input
                  id="find-nickname"
                  label="닉네임"
                  type="text"
                  placeholder="닉네임을 입력하세요"
                  value={findIdValue}
                  onChange={(e) => setFindIdValue(e.target.value)}
                  required
                />
              ) : (
                <Input
                  id="find-phone"
                  label="휴대폰 번호"
                  type="tel"
                  placeholder="010-0000-0000"
                  value={findIdValue}
                  onChange={(e) => setFindIdValue(e.target.value)}
                  required
                />
              )}
              <Button type="submit" className="w-full" disabled={findIdLoading}>
                {findIdLoading ? '검색 중...' : '아이디 찾기'}
              </Button>
            </>
          )}
        </form>
      </Modal>

      {/* 비밀번호 찾기 모달 */}
      <Modal isOpen={resetPwOpen} onClose={() => setResetPwOpen(false)} title="비밀번호 찾기">
        {resetPwSent ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-4 text-center">
              <p className="font-medium mb-1">비밀번호 재설정 이메일을 발송했습니다.</p>
              <p className="text-emerald-600">{resetPwEmail}</p>
            </div>
            <p className="text-sm text-warm-500">
              이메일의 링크를 클릭하여 새 비밀번호를 설정해 주세요.
              이메일이 도착하지 않으면 스팸 폴더를 확인해 주세요.
            </p>
            <Button type="button" className="w-full" onClick={() => setResetPwOpen(false)}>
              로그인으로 돌아가기
            </Button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-sm text-warm-500">
              가입 시 사용한 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다.
            </p>
            {resetPwError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {resetPwError}
              </div>
            )}
            <Input
              id="reset-email"
              label="이메일"
              type="email"
              placeholder="가입한 이메일을 입력하세요"
              value={resetPwEmail}
              onChange={(e) => setResetPwEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={resetPwLoading}>
              {resetPwLoading ? '발송 중...' : '비밀번호 재설정 이메일 보내기'}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
