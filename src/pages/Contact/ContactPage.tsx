import { useState } from 'react';
import { Mail, Phone, Clock, MapPin, Send, CheckCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { db } from '@/lib/firebase';

const contactInfo = [
  { icon: Mail, label: '이메일', value: 'support@jikgyeolin.kr', href: 'mailto:support@jikgyeolin.kr' },
  { icon: Phone, label: '전화', value: '02-1234-5678', href: 'tel:02-1234-5678' },
  { icon: Clock, label: '운영시간', value: '평일 09:00 ~ 18:00 (주말·공휴일 휴무)' },
  { icon: MapPin, label: '주소', value: '서울특별시 강남구 테헤란로 123' },
];

const faqItems = [
  {
    q: '서비스 이용에 비용이 발생하나요?',
    a: '기본 서비스(구인구직 등록, 업체 등록, 커뮤니티)는 무료입니다. AI 디자인 등 일부 프리미엄 기능은 Pro/Business 구독을 통해 이용하실 수 있습니다.',
  },
  {
    q: '업체 등록은 어떻게 하나요?',
    a: '회원가입 후 "인테리어 업체 등록" 또는 "자재업체 등록" 메뉴에서 업체 정보, 포트폴리오, 연락처를 입력하면 바로 등록됩니다.',
  },
  {
    q: '문의에 대한 답변은 얼마나 걸리나요?',
    a: '영업일 기준 1~2일 이내에 이메일로 답변 드립니다. 긴급한 문의는 전화 상담을 이용해 주세요.',
  },
  {
    q: '신고는 어떻게 처리되나요?',
    a: '각 게시물의 신고하기 기능을 통해 접수하시면, 관리자가 검토 후 운영 정책에 따라 조치합니다. 처리 결과는 별도 안내드립니다.',
  },
];

export function ContactPage() {
  usePageTitle('문의하기');
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: user?.email || '',
    category: '일반 문의',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...form,
        uid: user?.uid || null,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch {
      alert('문의 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-warm-800 mb-3">문의가 접수되었습니다</h1>
        <p className="text-warm-500 mb-1">영업일 기준 1~2일 이내에 입력하신 이메일로 답변 드리겠습니다.</p>
        <p className="text-warm-400 text-sm mb-8">빠른 확인이 필요하시면 전화 상담(02-1234-5678)을 이용해 주세요.</p>
        <Button onClick={() => { setSubmitted(false); setForm({ name: '', email: user?.email || '', category: '일반 문의', message: '' }); }}>
          추가 문의하기
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* 헤더 */}
      <section className="text-center mb-10">
        <h1 className="text-3xl font-bold text-warm-800 mb-3">문의하기</h1>
        <p className="text-warm-500">
          서비스 이용 중 궁금한 점이나 불편 사항이 있으시면 언제든 문의해 주세요.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* 문의 폼 */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="py-6">
              <h2 className="font-bold text-warm-800 mb-4">문의 양식</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1">이름 *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="이름을 입력해 주세요"
                    required
                    className="w-full px-3 py-2.5 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1">이메일 *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="답변 받으실 이메일"
                    required
                    className="w-full px-3 py-2.5 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1">문의 유형</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                  >
                    <option>일반 문의</option>
                    <option>서비스 이용 문의</option>
                    <option>업체 등록 문의</option>
                    <option>결제/구독 문의</option>
                    <option>신고/불편 접수</option>
                    <option>제휴/협업 제안</option>
                    <option>기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-700 mb-1">문의 내용 *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="문의 내용을 자세히 작성해 주세요"
                    required
                    rows={6}
                    className="w-full px-3 py-2.5 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                  />
                </div>
                <Button type="submit" disabled={submitting} className="w-full">
                  <Send className="w-4 h-4 mr-1" />
                  {submitting ? '접수 중...' : '문의 접수'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* 연락처 정보 */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="py-6">
              <h2 className="font-bold text-warm-800 mb-4">연락처 정보</h2>
              <div className="space-y-4">
                {contactInfo.map((c) => (
                  <div key={c.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                      <c.icon className="w-4 h-4 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-xs text-warm-400">{c.label}</p>
                      {c.href ? (
                        <a href={c.href} className="text-sm font-medium text-warm-800 hover:text-primary-500 transition-colors">
                          {c.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-warm-800">{c.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <h2 className="font-bold text-warm-800 mb-3">답변 안내</h2>
              <ul className="text-sm text-warm-500 space-y-2">
                <li>- 영업일 기준 1~2일 이내 이메일 답변</li>
                <li>- 긴급 문의는 전화 상담 이용</li>
                <li>- 신고/불편 접수는 우선 처리</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-warm-800 mb-6 text-center">자주 묻는 질문</h2>
        <div className="space-y-3">
          {faqItems.map((faq, i) => (
            <Card key={i}>
              <CardContent className="py-5">
                <p className="font-semibold text-warm-800 mb-2">Q. {faq.q}</p>
                <p className="text-sm text-warm-500 leading-relaxed">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
