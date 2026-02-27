import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Package, Truck, Banknote, MessageCircle, Flag, User, Send, Trash2 } from 'lucide-react';
import {
  doc, getDoc, updateDoc, increment,
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc,
} from 'firebase/firestore';
import { categories } from '@/data/categories';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Rating } from '@/components/ui/Rating';
import { BlockRenderer } from '@/components/community/BlockRenderer';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPromptModal } from '@/components/LoginPromptModal';
import { ReportModal } from '@/components/ReportModal';
import { findOrCreateChatRoom } from '@/utils/chat';
import { formatDate } from '@/utils/format';
import type { Supplier, CommunityComment } from '@/types';

export function SupplierDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [supplier, setSupplier] = useState<Supplier | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'suppliers', id);
    getDoc(docRef)
      .then((snap) => {
        if (snap.exists()) {
          setSupplier({ id: snap.id, ...snap.data() } as Supplier);
          updateDoc(docRef, { views: increment(1) }).catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // Subscribe to comments
  useEffect(() => {
    if (!id) return;
    const commentsRef = collection(db, 'suppliers', id, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CommunityComment));
    });
    return unsub;
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!user || !id || !commentText.trim() || commentLoading) return;
    setCommentLoading(true);
    try {
      await addDoc(collection(db, 'suppliers', id, 'comments'), {
        text: commentText.trim(),
        author: profile?.nickname || '익명',
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'suppliers', id), { commentCount: increment(1) });
      setCommentText('');
    } catch {
      // silently fail
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, 'suppliers', id, 'comments', commentId));
      await updateDoc(doc(db, 'suppliers', id), { commentCount: increment(-1) });
    } catch {
      // silently fail
    }
  };

  const formatCommentDate = (createdAt: CommunityComment['createdAt']) => {
    if (!createdAt) return '';
    if (typeof createdAt === 'string') return formatDate(createdAt);
    try {
      const d = createdAt.toDate();
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return '방금 전';
      if (mins < 60) return `${mins}분 전`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}시간 전`;
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days}일 전`;
      return d.toLocaleDateString('ko-KR');
    } catch {
      return '';
    }
  };

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

          <div className="mb-6">
            <BlockRenderer blocks={supplier.blocks} content={supplier.description} />
          </div>

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

          {/* 기존 데이터 하위 호환: blocks 없는 경우에만 이미지 그리드 표시 */}
          {!supplier.blocks && supplier.images && supplier.images.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-warm-800 mb-3">제품/매장 사진</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {supplier.images.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`제품 사진 ${i + 1}`}
                    className="aspect-[4/3] rounded-lg object-cover border border-warm-200"
                  />
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

          {/* 댓글 섹션 */}
          <div className="mt-8 pt-6 border-t border-warm-200">
            <h3 className="font-semibold text-warm-800 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              댓글 {comments.length > 0 && <span className="text-primary-500">{comments.length}</span>}
            </h3>

            {comments.length > 0 ? (
              <div className="space-y-4 mb-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-warm-100 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-warm-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-warm-700">{comment.author}</span>
                        <span className="text-xs text-warm-400">{formatCommentDate(comment.createdAt)}</span>
                        {user && comment.uid === user.uid && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="ml-auto text-warm-300 hover:text-red-500 transition-colors cursor-pointer"
                            title="댓글 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-warm-600 leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-warm-400 mb-4">
                아직 댓글이 없습니다
              </div>
            )}

            {user ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleCommentSubmit();
                    }
                  }}
                  placeholder="댓글을 입력하세요..."
                  className="flex-1 px-4 py-2.5 border border-warm-200 rounded-lg text-sm text-warm-700 placeholder:text-warm-300 focus:outline-none focus:border-primary-400 transition-colors"
                />
                <button
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim() || commentLoading}
                  className="px-4 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-warm-200 text-white disabled:text-warm-400 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center py-3">
                <Link to="/login" className="text-sm text-primary-500 hover:text-primary-600 transition-colors">
                  로그인 후 댓글을 작성할 수 있습니다
                </Link>
              </div>
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

      <LoginPromptModal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </div>
  );
}
