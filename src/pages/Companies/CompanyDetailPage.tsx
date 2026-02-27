import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MapPin, Users, Calendar, Briefcase, X, MessageCircle, Star, Flag, Phone, Mail, ChevronLeft, ChevronRight, Grid2x2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { categories } from '@/data/categories';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPromptModal } from '@/components/LoginPromptModal';
import { ReportModal } from '@/components/ReportModal';
import { findOrCreateChatRoom } from '@/utils/chat';
import type { Company, Review } from '@/types';

function ReviewItem({ review }: { review: Review }) {
  return (
    <div className="py-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-warm-200 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-warm-600">{review.author[0]}</span>
        </div>
        <div>
          <p className="font-semibold text-warm-800 text-sm">{review.author}</p>
          <p className="text-xs text-warm-400">{review.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 mb-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i < Math.round(review.rating) ? 'fill-warm-800 text-warm-800' : 'text-warm-200'}`}
          />
        ))}
      </div>
      <h4 className="font-medium text-warm-800 mb-1">{review.title}</h4>
      <p className="text-sm text-warm-600 leading-relaxed">{review.content}</p>
      {review.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {review.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-warm-100 text-warm-500 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
      {review.imageUrl && (
        <div className="mt-3 w-32 h-24 rounded-lg overflow-hidden">
          <img src={review.imageUrl} alt={review.title} className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}

export function CompanyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [company, setCompany] = useState<Company | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
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
  const galleryImages = portfolioImages.slice(0, 5);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : company.rating.toFixed(1);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? portfolioImages.length - 1 : lightboxIndex - 1);
    }
  };
  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === portfolioImages.length - 1 ? 0 : lightboxIndex + 1);
    }
  };

  return (
    <div className="pb-24 lg:pb-8">
      {/* 포토 갤러리 */}
      {galleryImages.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <div className="relative rounded-2xl overflow-hidden">
            {galleryImages.length >= 5 ? (
              /* 5장 이상: 1 large + 4 small */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 h-[280px] sm:h-[400px]">
                <button
                  type="button"
                  onClick={() => openLightbox(0)}
                  className="relative overflow-hidden cursor-pointer rounded-l-2xl"
                >
                  <img
                    src={galleryImages[0]}
                    alt={`${company.name} 사진 1`}
                    className="w-full h-full object-cover hover:brightness-90 transition-all"
                  />
                </button>
                <div className="hidden sm:grid grid-cols-2 gap-2">
                  {galleryImages.slice(1, 5).map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => openLightbox(i + 1)}
                      className={`relative overflow-hidden cursor-pointer ${i === 1 ? 'rounded-tr-2xl' : ''} ${i === 3 ? 'rounded-br-2xl' : ''}`}
                    >
                      <img
                        src={url}
                        alt={`${company.name} 사진 ${i + 2}`}
                        className="w-full h-full object-cover hover:brightness-90 transition-all"
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* 5장 미만: 그리드 */
              <div className={`grid gap-2 h-[280px] sm:h-[400px] ${galleryImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {galleryImages.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => openLightbox(i)}
                    className="relative overflow-hidden cursor-pointer first:rounded-l-2xl last:rounded-r-2xl"
                  >
                    <img
                      src={url}
                      alt={`${company.name} 사진 ${i + 1}`}
                      className="w-full h-full object-cover hover:brightness-90 transition-all"
                    />
                  </button>
                ))}
              </div>
            )}
            {/* 사진 모두 보기 버튼 */}
            {portfolioImages.length > 1 && (
              <button
                type="button"
                onClick={() => setShowAllPhotos(true)}
                className="absolute bottom-4 right-4 flex items-center gap-1.5 px-4 py-2 bg-white rounded-lg text-sm font-medium text-warm-800 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <Grid2x2 className="w-4 h-4" />
                사진 모두 보기
              </button>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* 왼쪽: 메인 정보 */}
          <div className="lg:col-span-2">
            {/* 제목 섹션 */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-warm-900 mb-2">{company.name}</h1>
              <div className="flex flex-wrap items-center gap-1.5 text-sm">
                <Star className="w-4 h-4 fill-warm-800 text-warm-800" />
                <span className="font-semibold text-warm-800">{avgRating}</span>
                <span className="text-warm-400">·</span>
                <span className="text-warm-600 underline">리뷰 {company.reviewCount}개</span>
                <span className="text-warm-400">·</span>
                <span className="text-warm-600">{company.location}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {company.categories.map((catId) => {
                  const cat = categories.find((c) => c.id === catId);
                  return cat ? <Badge key={catId} variant="primary">{cat.name}</Badge> : null;
                })}
              </div>
            </div>

            <hr className="border-warm-200 mb-8" />

            {/* 정보 그리드 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-warm-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-warm-400 mb-0.5">위치</p>
                  <p className="text-sm font-medium text-warm-800">{company.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-warm-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-warm-400 mb-0.5">경력</p>
                  <p className="text-sm font-medium text-warm-800">{company.experience}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-warm-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-warm-400 mb-0.5">직원 수</p>
                  <p className="text-sm font-medium text-warm-800">{company.employeeCount}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-warm-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-warm-400 mb-0.5">등록일</p>
                  <p className="text-sm font-medium text-warm-800">{company.createdAt}</p>
                </div>
              </div>
            </div>

            <hr className="border-warm-200 mb-8" />

            {/* 업체 소개 */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-warm-900 mb-4">업체 소개</h2>
              <p className="text-warm-600 leading-relaxed whitespace-pre-line">{company.description}</p>
            </div>

            {/* 포트폴리오 */}
            {company.portfolio.length > 0 && (
              <>
                <hr className="border-warm-200 mb-8" />
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-warm-900 mb-4">포트폴리오</h2>
                  <div className="space-y-2">
                    {company.portfolio.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 py-2">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full shrink-0" />
                        <span className="text-sm text-warm-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <hr className="border-warm-200 mb-8" />

            {/* 후기 섹션 */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 fill-warm-800 text-warm-800" />
                <h2 className="text-xl font-semibold text-warm-900">
                  {avgRating} · 후기 {reviews.length}개
                </h2>
              </div>
              {reviews.length > 0 ? (
                <div className="divide-y divide-warm-100">
                  {reviews.map((review) => (
                    <ReviewItem key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-warm-400 py-8">아직 후기가 없습니다</p>
              )}
            </div>
          </div>

          {/* 오른쪽: 사이드바 (데스크톱) */}
          <div className="hidden lg:block">
            <div className="sticky top-24 border border-warm-200 rounded-2xl p-6 shadow-lg">
              {/* 업체 아바타 */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-primary-600 font-bold text-xl">{company.name[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-warm-800">{company.name}</p>
                  <div className="flex items-center gap-1 text-sm text-warm-500">
                    <Star className="w-3 h-3 fill-warm-600 text-warm-600" />
                    <span>{avgRating}</span>
                    <span>· 리뷰 {company.reviewCount}개</span>
                  </div>
                </div>
              </div>

              {/* 연락처 */}
              {company.phone && (
                <div className="flex items-center gap-2.5 py-3 border-t border-warm-100">
                  <Phone className="w-4 h-4 text-warm-400" />
                  <span className="text-sm text-warm-700">{company.phone}</span>
                </div>
              )}
              {company.contact && (
                <div className="flex items-center gap-2.5 py-3 border-t border-warm-100">
                  <Mail className="w-4 h-4 text-warm-400" />
                  <span className="text-sm text-warm-700">{company.contact}</span>
                </div>
              )}

              {/* 채팅 상담 버튼 */}
              <div className="mt-4">
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
              </div>

              {/* 신고 */}
              {user && (
                <button
                  onClick={() => setShowReport(true)}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 text-sm text-warm-400 hover:text-red-500 transition-colors cursor-pointer mt-3"
                >
                  <Flag className="w-3.5 h-3.5" />
                  신고하기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 하단 고정 바 */}
      {!isOwnListing && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-warm-200 p-4 z-40">
          <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
            <div>
              <p className="font-semibold text-warm-800 text-sm">{company.name}</p>
              <div className="flex items-center gap-1 text-xs text-warm-500">
                <Star className="w-3 h-3 fill-warm-600 text-warm-600" />
                <span>{avgRating}</span>
                <span>· 리뷰 {company.reviewCount}개</span>
              </div>
            </div>
            <button
              onClick={handleStartChat}
              disabled={chatLoading}
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              {chatLoading ? '연결 중...' : '채팅 상담'}
            </button>
          </div>
        </div>
      )}

      {/* 모달들 */}
      {company && (
        <ReportModal
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          targetType="company"
          targetId={company.id}
          targetTitle={company.name}
        />
      )}
      <LoginPromptModal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />

      {/* 사진 모두 보기 모달 */}
      {showAllPhotos && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-warm-200 z-10">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
              <button
                onClick={() => setShowAllPhotos(false)}
                className="p-2 hover:bg-warm-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-warm-700" />
              </button>
              <span className="text-sm font-medium text-warm-600">
                사진 {portfolioImages.length}장
              </span>
              <div className="w-9" />
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="space-y-2">
              {portfolioImages.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setShowAllPhotos(false); openLightbox(i); }}
                  className="w-full cursor-pointer"
                >
                  <img
                    src={url}
                    alt={`${company.name} 사진 ${i + 1}`}
                    className="w-full rounded-lg object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 이미지 라이트박스 (이전/다음 네비게이션) */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={closeLightbox}
        >
          {/* 닫기 */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors cursor-pointer z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* 카운터 */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white text-sm font-medium z-10">
            {lightboxIndex + 1} / {portfolioImages.length}
          </div>

          {/* 이전 */}
          {portfolioImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors cursor-pointer z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* 이미지 */}
          <img
            src={portfolioImages[lightboxIndex]}
            alt={`시공 사례 ${lightboxIndex + 1}`}
            className="max-w-full max-h-[85vh] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* 다음 */}
          {portfolioImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors cursor-pointer z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
