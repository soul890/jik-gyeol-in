import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Clock, Eye, User, MessageCircle, Flag, Send, Trash2 } from 'lucide-react';
import {
  doc, getDoc, updateDoc, increment,
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc,
} from 'firebase/firestore';
import { categories } from '@/data/categories';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { BlockRenderer } from '@/components/community/BlockRenderer';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPromptModal } from '@/components/LoginPromptModal';
import { ReportModal } from '@/components/ReportModal';
import { findOrCreateChatRoom } from '@/utils/chat';
import { formatDate } from '@/utils/format';
import type { Job, CommunityComment } from '@/types';

export function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [job, setJob] = useState<Job | undefined>(undefined);
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

    const docRef = doc(db, 'jobs', id);
    getDoc(docRef)
      .then((snap) => {
        if (snap.exists()) {
          setJob({ id: snap.id, ...snap.data() } as Job);
          updateDoc(docRef, { views: increment(1) }).catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // Subscribe to comments
  useEffect(() => {
    if (!id) return;
    const commentsRef = collection(db, 'jobs', id, 'comments');
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
      await addDoc(collection(db, 'jobs', id, 'comments'), {
        text: commentText.trim(),
        author: profile?.nickname || '익명',
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'jobs', id), { commentCount: increment(1) });
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
      await deleteDoc(doc(db, 'jobs', id, 'comments', commentId));
      await updateDoc(doc(db, 'jobs', id), { commentCount: increment(-1) });
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

  const isOwnListing = !!user && !!job?.uid && job.uid === user.uid;

  const handleStartChat = async () => {
    if (!job) return;
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setChatLoading(true);
    try {
      const roomId = await findOrCreateChatRoom({
        currentUserId: user.uid,
        currentUserName: profile?.nickname || user.email || '사용자',
        otherUserId: job.uid || `listing-job-${job.id}`,
        otherUserName: job.author,
        context: { type: 'job', id: job.id, title: job.title },
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

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-warm-700 mb-4">게시글을 찾을 수 없습니다</h2>
        <Link to="/jobs">
          <Button variant="outline">목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  const category = categories.find((c) => c.id === job.categoryId);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-warm-500 hover:text-warm-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        목록으로
      </Link>

      <Card>
        <CardContent className="py-6">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge variant={job.type === '구인' ? 'primary' : 'accent'}>{job.type}</Badge>
            {job.isUrgent && <Badge variant="warning">급구</Badge>}
            {category && <Badge>{category.name}</Badge>}
          </div>

          <h1 className="text-2xl font-bold text-warm-800 mb-4">{job.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-warm-500 mb-6 pb-6 border-b border-warm-200">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {job.author}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDate(job.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              조회 {job.views}
            </span>
          </div>

          <div className="mb-6">
            <div className="inline-block px-4 py-2 bg-primary-50 rounded-lg mb-6">
              <span className="text-sm text-warm-500">급여/단가</span>
              <p className="text-lg font-bold text-primary-700">{job.pay}</p>
            </div>

            <BlockRenderer blocks={job.blocks} content={job.description} />
          </div>

          <div className="pt-6 border-t border-warm-200">
            {isOwnListing ? (
              <div className="text-center text-sm text-warm-400 py-3">내가 작성한 글입니다</div>
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

      {job && (
        <ReportModal
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          targetType="job"
          targetId={job.id}
          targetTitle={job.title}
        />
      )}

      <LoginPromptModal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </div>
  );
}
