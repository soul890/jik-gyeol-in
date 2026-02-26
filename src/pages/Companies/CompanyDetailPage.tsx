import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Users, Calendar, Briefcase, X, MessageCircle, Star, Send } from 'lucide-react';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { companies as staticCompanies } from '@/data/companies';
import { categories } from '@/data/categories';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Rating } from '@/components/ui/Rating';
import { Modal } from '@/components/ui/Modal';
import { db } from '@/lib/firebase';
import type { Company, Review } from '@/types';

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="py-5">
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-warm-800 text-base mb-1.5">{review.title}</h4>
          <p className="text-sm text-warm-600 leading-relaxed line-clamp-2 mb-2.5">{review.content}</p>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {review.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-warm-100 text-warm-500 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-warm-700">{review.rating.toFixed(1)}</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < Math.round(review.rating) ? 'fill-amber-400 text-amber-400' : 'text-warm-200'}`}
                />
              ))}
            </div>
            <span className="text-warm-400">{review.author}</span>
            <span className="text-warm-300">|</span>
            <span className="text-warm-400">{review.date}</span>
          </div>
        </div>
        {review.imageUrl && (
          <div className="shrink-0 w-24 h-20 sm:w-32 sm:h-24 rounded-lg overflow-hidden">
            <img
              src={review.imageUrl}
              alt={review.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const staticMatch = staticCompanies.find((c) => c.id === id);
    if (staticMatch) {
      setCompany(staticMatch);
      setLoading(false);
      return;
    }

    if (!id) {
      setLoading(false);
      return;
    }

    getDoc(doc(db, 'companies', id))
      .then((snap) => {
        if (snap.exists()) {
          setCompany({ id: snap.id, ...snap.data() } as Company);
        }
      })
      .catch(() => {
        // Firebase 미연결
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        companyId: company.id,
        companyName: company.name,
        name: inquiryForm.name,
        phone: inquiryForm.phone,
        message: inquiryForm.message,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowInquiryModal(false);
    setInquiryForm({ name: '', phone: '', message: '' });
    setSubmitted(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-warm-700 mb-4">업체를 찾을 수 없습니다</h2>
        <Link to="/companies">
          <Button variant="outline">목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  const portfolioImages = company.portfolioImages ?? [];
  const reviews = company.reviews ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/companies" className="inline-flex items-center gap-1 text-sm text-warm-500 hover:text-warm-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        목록으로
      </Link>

      <Card>
        <CardContent className="py-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-primary-600 font-bold text-2xl">{company.name[0]}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-warm-800 mb-1">{company.name}</h1>
              <Rating value={company.rating} size="md" />
              <p className="text-sm text-warm-400 mt-1">리뷰 {company.reviewCount}개</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {company.categories.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              return cat ? <Badge key={catId} variant="primary">{cat.name}</Badge> : null;
            })}
          </div>

          <p className="text-warm-700 leading-relaxed mb-6">{company.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-warm-50 rounded-xl">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-warm-400" />
              <div>
                <p className="text-xs text-warm-400">위치</p>
                <p className="text-sm font-medium text-warm-700">{company.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-warm-400" />
              <div>
                <p className="text-xs text-warm-400">경력</p>
                <p className="text-sm font-medium text-warm-700">{company.experience}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-warm-400" />
              <div>
                <p className="text-xs text-warm-400">직원 수</p>
                <p className="text-sm font-medium text-warm-700">{company.employeeCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-warm-400" />
              <div>
                <p className="text-xs text-warm-400">등록일</p>
                <p className="text-sm font-medium text-warm-700">{company.createdAt}</p>
              </div>
            </div>
          </div>

          {portfolioImages.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-warm-800 mb-3">시공 사례 사진</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {portfolioImages.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxUrl(url)}
                    className="aspect-[4/3] rounded-lg overflow-hidden border border-warm-200 cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={url}
                      alt={`시공 사례 ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-semibold text-warm-800 mb-3">포트폴리오</h3>
            <div className="space-y-2">
              {company.portfolio.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-warm-50 rounded-lg">
                  <div className="w-2 h-2 bg-primary-400 rounded-full" />
                  <span className="text-sm text-warm-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 연락처: 채팅 상담 버튼 */}
          <div className="pt-6 border-t border-warm-200">
            <button
              onClick={() => setShowInquiryModal(true)}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              채팅으로 상담하기
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 고객 후기 섹션 */}
      <div className="mt-6">
        <Card>
          <CardContent className="py-6">
            <h3 className="text-base font-semibold text-warm-800 mb-1">
              총 <span className="text-primary-500">{reviews.length}개</span>의 고객 후기
            </h3>
            {reviews.length > 0 ? (
              <div className="divide-y divide-warm-100">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-warm-400 py-8 text-center">아직 후기가 없습니다</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 이미지 라이트박스 */}
      {lightboxUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setLightboxUrl(null)}>
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxUrl}
            alt="시공 사례"
            className="max-w-full max-h-[85vh] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* 채팅 상담 모달 */}
      <Modal isOpen={showInquiryModal} onClose={handleCloseModal} title={`${company.name} 상담 문의`}>
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-warm-800 mb-2">상담 신청이 완료되었습니다</h4>
            <p className="text-sm text-warm-500 mb-6">업체에서 빠른 시일 내에 연락드리겠습니다.</p>
            <Button onClick={handleCloseModal} className="w-full">확인</Button>
          </div>
        ) : (
          <form onSubmit={handleInquirySubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">이름</label>
              <input
                type="text"
                required
                value={inquiryForm.name}
                onChange={(e) => setInquiryForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="홍길동"
                className="w-full px-3 py-2.5 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">연락처</label>
              <input
                type="tel"
                required
                value={inquiryForm.phone}
                onChange={(e) => setInquiryForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="010-0000-0000"
                className="w-full px-3 py-2.5 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">문의 내용</label>
              <textarea
                required
                rows={4}
                value={inquiryForm.message}
                onChange={(e) => setInquiryForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="상담 받고 싶은 내용을 자유롭게 작성해주세요."
                className="w-full px-3 py-2.5 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              {submitting ? '전송 중...' : '상담 신청하기'}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
