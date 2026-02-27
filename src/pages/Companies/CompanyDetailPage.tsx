import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Users, Calendar, Briefcase, X, MessageCircle, Star, Flag } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { categories } from '@/data/categories';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Rating } from '@/components/ui/Rating';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPromptModal } from '@/components/LoginPromptModal';
import { ReportModal } from '@/components/ReportModal';
import { findOrCreateChatRoom } from '@/utils/chat';
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
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [company, setCompany] = useState<Company | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
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
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const isOwnListing = !!user && !!company?.uid && company.uid === user.uid;

  const handleStartChat = async () => {
    if (!company) return;
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setChatLoading(true);
    try {
      const roomId = await findOrCreateChatRoom({
        currentUserId: user.uid,
        currentUserName: profile?.nickname || user.email || '사용자',
        otherUserId: company.uid || `listing-company-${company.id}`,
        otherUserName: company.name,
        context: { type: 'company', id: company.id, title: company.name },
      });
      navigate(`/chat/${roomId}`);
    } catch {
      // silently fail
    } finally {
      setChatLoading(false);
    }
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
            {isOwnListing ? (
              <div className="text-center text-sm text-warm-400 py-3">내가 등록한 업체입니다</div>
            ) : (
              <button
                onClick={handleStartChat}
                disabled={chatLoading}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-5 h-5" />
                {chatLoading ? '채팅방 연결 중...' : '채팅으로 상담하기'}
              </button>
            )}
            {user && (
              <button
                onClick={() => setShowReport(true)}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 text-sm text-warm-400 hover:text-red-500 transition-colors cursor-pointer mt-2"
              >
                <Flag className="w-3.5 h-3.5" />
                신고하기
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {company && (
        <ReportModal
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          targetType="company"
          targetId={company.id}
          targetTitle={company.name}
        />
      )}

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

      <LoginPromptModal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </div>
  );
}
