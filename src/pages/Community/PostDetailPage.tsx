import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Eye, ThumbsUp, MessageCircle, User, X, Flag } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { communityPosts as staticPosts } from '@/data/communityPosts';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { ReportModal } from '@/components/ReportModal';
import { formatDate } from '@/utils/format';
import type { CommunityPost } from '@/types';

const categoryVariant: Record<string, 'primary' | 'accent' | 'default'> = {
  '시공노하우': 'primary',
  '질문답변': 'accent',
  '자유게시판': 'default',
};

export function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<CommunityPost | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const staticMatch = staticPosts.find((p) => p.id === id);
    if (staticMatch) {
      setPost(staticMatch);
      setLoading(false);
      return;
    }

    if (!id) {
      setLoading(false);
      return;
    }

    getDoc(doc(db, 'communityPosts', id))
      .then((snap) => {
        if (snap.exists()) {
          setPost({ id: snap.id, ...snap.data() } as CommunityPost);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

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
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              {post.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {post.commentCount}
            </span>
          </div>

          <div className="prose prose-warm max-w-none">
            {post.content.split('\n').map((line, i) => (
              <p key={i} className="text-warm-700 leading-relaxed mb-1">
                {line || <br />}
              </p>
            ))}
          </div>

          {post.images && post.images.length > 0 && (
            <div className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {post.images.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxUrl(url)}
                    className="aspect-[4/3] rounded-lg overflow-hidden border border-warm-200 cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={url}
                      alt={`첨부 사진 ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-warm-200">
            <h3 className="font-semibold text-warm-800 mb-4">댓글 {post.commentCount}개</h3>
            <div className="space-y-4">
              <div className="p-4 bg-warm-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-warm-700">익명의 기사님</span>
                  <span className="text-xs text-warm-400">2시간 전</span>
                </div>
                <p className="text-sm text-warm-600">좋은 정보 감사합니다. 많은 도움이 되었습니다!</p>
              </div>
              <div className="p-4 bg-warm-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-warm-700">인테리어 입문자</span>
                  <span className="text-xs text-warm-400">5시간 전</span>
                </div>
                <p className="text-sm text-warm-600">자세한 설명 감사합니다. 참고하겠습니다.</p>
              </div>
            </div>
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
            alt="첨부 사진"
            className="max-w-full max-h-[85vh] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
