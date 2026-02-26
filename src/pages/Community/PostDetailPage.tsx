import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Eye, ThumbsUp, MessageCircle, User } from 'lucide-react';
import { communityPosts } from '@/data/communityPosts';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { formatDate } from '@/utils/format';

const categoryVariant: Record<string, 'primary' | 'accent' | 'default'> = {
  '시공노하우': 'primary',
  '질문답변': 'accent',
  '자유게시판': 'default',
};

export function PostDetailPage() {
  const { id } = useParams();
  const post = communityPosts.find((p) => p.id === id);

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
    </div>
  );
}
