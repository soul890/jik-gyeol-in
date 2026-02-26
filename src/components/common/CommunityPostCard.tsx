import { Link } from 'react-router-dom';
import { Eye, ThumbsUp, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/format';
import type { CommunityPost } from '@/types';

const categoryVariant: Record<string, 'primary' | 'accent' | 'default'> = {
  '시공노하우': 'primary',
  '질문답변': 'accent',
  '자유게시판': 'default',
};

interface CommunityPostCardProps {
  post: CommunityPost;
}

export function CommunityPostCard({ post }: CommunityPostCardProps) {
  return (
    <Link to={`/community/${post.id}`}>
      <Card hover>
        {post.images && post.images.length > 0 && (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={categoryVariant[post.category]}>{post.category}</Badge>
            <span className="text-xs text-warm-400">{formatDate(post.createdAt)}</span>
          </div>

          <h3 className="font-semibold text-warm-800 mb-2 line-clamp-2 leading-snug">
            {post.title}
          </h3>

          <p className="text-sm text-warm-500 line-clamp-2 mb-3">{post.content}</p>

          <div className="flex items-center gap-4 text-xs text-warm-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {post.views}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5" />
              {post.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              {post.commentCount}
            </span>
            <span className="ml-auto text-warm-500">{post.author}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
