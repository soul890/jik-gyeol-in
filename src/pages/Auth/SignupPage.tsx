import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export function SignupPage() {
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    if (!agreeTerms) {
      setError('이용약관 및 개인정보처리방침에 동의해주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    setSubmitting(true);
    try {
      await signup(email, password, nickname.trim(), address.trim(), phone.trim() || undefined);
      navigate('/');
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/email-already-in-use') {
        setError('이미 사용 중인 이메일입니다.');
      } else if (code === 'auth/invalid-email') {
        setError('유효하지 않은 이메일 형식입니다.');
      } else if (code === 'auth/weak-password') {
        setError('비밀번호가 너무 약합니다. 6자 이상 입력해주세요.');
      } else {
        setError('회원가입에 실패했습니다.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await loginWithGoogle();
      navigate('/');
    } catch {
      setError('Google 로그인에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-warm-800 text-center mb-8">회원가입</h1>
      <Card>
        <CardContent className="py-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}
            <Input
              id="nickname"
              label="닉네임"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
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
              placeholder="6자 이상 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              id="passwordConfirm"
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
            <Input
              id="phone"
              label="휴대폰 번호"
              type="tel"
              placeholder="010-0000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              id="address"
              label="주소"
              placeholder="예: 서울시 강남구"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-warm-300 text-primary-500 focus:ring-primary-500 cursor-pointer"
              />
              <span className="text-sm text-warm-600">
                <Link to="/terms" target="_blank" className="text-primary-600 hover:underline">이용약관</Link> 및{' '}
                <Link to="/privacy" target="_blank" className="text-primary-600 hover:underline">개인정보처리방침</Link>에
                동의합니다.
              </span>
            </label>
            <Button type="submit" className="w-full" disabled={submitting || !agreeTerms}>
              {submitting ? '가입 중...' : '회원가입'}
            </Button>
          </form>

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
            Google로 시작하기
          </button>

          <p className="mt-4 text-center text-sm text-warm-500">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              로그인
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
