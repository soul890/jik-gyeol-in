import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ArrowLeft, Eye, ThumbsUp, MessageCircle, User, Flag, Send, Trash2,
} from 'lucide-react';
import {
  doc, getDoc, updateDoc, increment, arrayUnion, arrayRemove,
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc,
} from 'firebase/firestore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { BlockRenderer } from '@/components/community/BlockRenderer';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { ReportModal } from '@/components/ReportModal';
import { formatDate } from '@/utils/format';
import type { CommunityPost, CommunityComment } from '@/types';

const categoryVariant: Record<string, 'primary' | 'accent' | 'default'> = {
  '시공노하우': 'primary',
  '질문답변': 'accent',
  '자유게시판': 'default',
};

export function PostDetailPage() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [post, setPost] = useState<CommunityPost | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);

  // Like state
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  // Comments state
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Fetch post + increment views
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'communityPosts', id);
    getDoc(docRef)
      .then((snap) => {
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() } as CommunityPost;
          setPost(data);
          setLikeCount(data.likes || 0);
          setLiked(!!user && (data.likedBy || []).includes(user.uid));
          updateDoc(docRef, { views: increment(1) }).catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, user]);

  // Subscribe to comments
  useEffect(() => {
    if (!id) return;

    const commentsRef = collection(db, 'communityPosts', id, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));

    const unsub = onSnapshot(q, (snap) => {
      setComments(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CommunityComment),
      );
    });

    return unsub;
  }, [id]);

  // Like toggle
  const handleLike = async () => {
    if (!user || !id || likeLoading) return;
    setLikeLoading(true);

    const docRef = doc(db, 'communityPosts', id);
    try {
      if (liked) {
        await updateDoc(docRef, {
          likes: increment(-1),
          likedBy: arrayRemove(user.uid),
        });
        setLiked(false);
        setLikeCount((c) => Math.max(0, c - 1));
      } else {
        await updateDoc(docRef, {
          likes: increment(1),
          likedBy: arrayUnion(user.uid),
        });
        setLiked(true);
        setLikeCount((c) => c + 1);
      }
    } catch {
      // silently fail
    } finally {
      setLikeLoading(false);
    }
  };

  // Submit comment
  const handleCommentSubmit = async () => {
    if (!user || !id || !commentText.trim() || commentLoading) return;
    setCommentLoading(true);

    try {
      const commentsRef = collection(db, 'communityPosts', id, 'comments');
      await addDoc(commentsRef, {
        text: commentText.trim(),
        author: profile?.nickname || '익명',
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'communityPosts', id), {
        commentCount: increment(1),
      });
      setCommentText('');
    } catch {
      // silently fail
    } finally {
      setCommentLoading(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, 'communityPosts', id, 'comments', commentId));
      await updateDoc(doc(db, 'communityPosts', id), {
        commentCount: increment(-1),
      });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-warm-700 mb-4">게시글을 찾을 수 없습니다</h2>
        <Link to="/community">
          <Button variant="outline">목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/community" className="inline-flex items-center gap-1 text-sm text-warm-500 hover:text-warm-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        목록으로
      </Link>

      <Card>
        <CardContent className="py-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={categoryVariant[post.category]}>{post.category}</Badge>
          </div>

          <h1 className="text-2xl font-bold text-warm-800 mb-4">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-warm-500 mb-6 pb-6 border-b border-warm-200">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span>{formatDate(post.createdAt)}</span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.views}
            </span>
          </div>

          <BlockRenderer blocks={post.blocks} content={post.content} />

          {/* 좋아요 버튼 */}
          <div className="mt-8 pt-6 border-t border-warm-200 flex items-center justify-center">
            <button
              onClick={handleLike}
              disabled={!user || likeLoading}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full border transition-colors cursor-pointer disabled:cursor-not-allowed ${
                liked
                  ? 'bg-primary-50 border-primary-300 text-primary-600'
                  : 'border-warm-200 text-warm-500 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-primary-500' : ''}`} />
              <span className="font-medium">좋아요 {likeCount > 0 ? likeCount : ''}</span>
            </button>
          </div>

          {/* 댓글 섹션 */}
          <div className="mt-8 pt-6 border-t border-warm-200">
            <h3 className="font-semibold text-warm-800 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              댓글 {comments.length > 0 && <span className="text-primary-500">{comments.length}</span>}
            </h3>

            {/* 댓글 목록 */}
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

            {/* 댓글 입력 */}
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

      {/* 신고 버튼 */}
      {user && post && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowReport(true)}
            className="inline-flex items-center gap-1.5 text-sm text-warm-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5" />
            이 게시글 신고하기
          </button>
        </div>
      )}

      {post && (
        <ReportModal
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          targetType="post"
          targetId={post.id}
          targetTitle={post.title}
        />
      )}
    </div>
  );
}
