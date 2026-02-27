import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { SectionHeader } from '@/components/common/SectionHeader';
import { db } from '@/lib/firebase';
import { formatDate } from '@/utils/format';
import type { CommunityPost } from '@/types';

export function RecentCommunity() {
  const [firestorePosts, setFirestorePosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    getDocs(collection(db, 'communityPosts'))
      .then((snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CommunityPost[];
        setFirestorePosts(docs);
      })
      .catch(() => {});
  }, []);

  const recentPosts = useMemo(() => {
    return [...firestorePosts]
      .sort((a, b) => {
        const getTime = (v: unknown): number => {
          if (!v) return 0;
          if (typeof v === 'string') return new Date(v).getTime();
          if (typeof v === 'object' && v !== null && 'seconds' in v) return (v as { seconds: number }).seconds * 1000;
          return 0;
        };
        return getTime(b.createdAt) - getTime(a.createdAt);
      })
      .slice(0, 3);
  }, [firestorePosts]);

  if (recentPosts.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      <SectionHeader
        title="커뮤니티 & 팁"
        subtitle="시공 노하우와 질문을 나눠보세요"
        linkTo="/community"
        linkText="전체보기"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {recentPosts.map((post) => (
          <Link
            key={post.id}
            to={`/community/${post.id}`}
            className="group bg-white border border-warm-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
          >
            {post.images && post.images.length > 0 ? (
              <div
                className="w-full aspect-[16/9] bg-cover bg-center"
                style={{ backgroundImage: `url(${post.images[0]})` }}
              />
            ) : (
              <div className="w-full aspect-[16/9] bg-warm-100 flex items-center justify-center">
                <span className="text-warm-300 text-sm">이미지 없음</span>
              </div>
            )}
            <div className="p-4">
              <h4 className="font-semibold text-warm-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                {post.title}
              </h4>
              <p className="text-sm text-warm-500 leading-relaxed line-clamp-2 mb-3">
                {post.content}
              </p>
              <div className="flex items-center gap-2 text-xs text-warm-400">
                <span>{post.author}</span>
                <span>·</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
