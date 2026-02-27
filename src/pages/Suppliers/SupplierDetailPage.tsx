import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Package, Truck, Banknote, MessageCircle, X, Flag } from 'lucide-react';
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
import type { Supplier } from '@/types';

export function SupplierDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [supplier, setSupplier] = useState<Supplier | undefined>(undefined);
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

    getDoc(doc(db, 'suppliers', id))
      .then((snap) => {
        if (snap.exists()) {
          setSupplier({ id: snap.id, ...snap.data() } as Supplier);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const isOwnListing = !!user && !!supplier?.uid && supplier.uid === user.uid;

  const handleStartChat = async () => {
    if (!supplier) return;
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setChatLoading(true);
    try {
      const roomId = await findOrCreateChatRoom({
        currentUserId: user.uid,
        currentUserName: profile?.nickname || user.email || '사용자',
        otherUserId: supplier.uid || `listing-supplier-${supplier.id}`,
        otherUserName: supplier.name,
        context: { type: 'supplier', id: supplier.id, title: supplier.name },
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

  if (!supplier) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-warm-700 mb-4">업체를 찾을 수 없습니다</h2>
        <Link to="/suppliers">
          <Button variant="outline">목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/suppliers" className="inline-flex items-center gap-1 text-sm text-warm-500 hover:text-warm-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        목록으로
      </Link>

      <Card>
        <CardContent className="py-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
              <Package className="w-8 h-8 text-accent" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-warm-800 mb-1">{supplier.name}</h1>
              <Rating value={supplier.rating} size="md" />
              <p className="text-sm text-warm-400 mt-1">리뷰 {supplier.reviewCount}개</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {supplier.categories.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              return cat ? <Badge key={catId} variant="primary">{cat.name}</Badge> : null;
            })}
          </div>

          <p className="text-warm-700 leading-relaxed mb-6">{supplier.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-warm-50 rounded-xl">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-warm-400" />
              <div>
                <p className="text-xs text-warm-400">위치</p>
                <p className="text-sm font-medium text-warm-700">{supplier.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Banknote className="w-4 h-4 text-warm-400" />
              <div>
                <p className="text-xs text-warm-400">최소 주문</p>
                <p className="text-sm font-medium text-warm-700">{supplier.minOrderAmount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-warm-400" />
              <div>
                <p className="text-xs text-warm-400">배송</p>
                <p className="text-sm font-medium text-warm-700">{supplier.deliveryInfo}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-warm-800 mb-3">취급 제품</h3>
            <div className="flex flex-wrap gap-2">
              {supplier.products.map((product) => (
                <Badge key={product} variant="default">{product}</Badge>
              ))}
            </div>
          </div>

          {supplier.images && supplier.images.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-warm-800 mb-3">제품/매장 사진</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {supplier.images.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxUrl(url)}
                    className="aspect-[4/3] rounded-lg overflow-hidden border border-warm-200 cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={url}
                      alt={`제품 사진 ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

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

      {supplier && (
        <ReportModal
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          targetType="supplier"
          targetId={supplier.id}
          targetTitle={supplier.name}
        />
      )}

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
            alt="제품 사진"
            className="max-w-full max-h-[85vh] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <LoginPromptModal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </div>
  );
}
