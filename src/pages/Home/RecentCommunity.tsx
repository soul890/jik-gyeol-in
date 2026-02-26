import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { communityPosts as staticPosts } from '@/data/communityPosts';
import { SectionHeader } from '@/components/common/SectionHeader';
import { db } from '@/lib/firebase';
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
    const firestoreIds = new Set(firestorePosts.map((d) => d.id));
    const uniqueStatic = staticPosts.filter((d) => !firestoreIds.has(d.id));
    return [...firestorePosts, ...uniqueStatic]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [firestorePosts]);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      <SectionHeader
        title="커뮤니티 & 팁"
        subtitle="시공 노하우와 질문을 나눠보세요"
        linkTo="/community"
        linkText="전체보기"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentPosts.map((post) => (
          <Link
            key={post.id}
            to={`/community/${post.id}`}
            className="group bg-white border border-warm-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* 썸네일 (추후 이미지 교체) */}
            <div
              className="w-full aspect-[16/9] bg-cover bg-center"
              style={{
                backgroundImage: `url(/images/community-${post.id}.jpg)`,
                backgroundColor: '#D4C5B2',
              }}
            />
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
                <span>{post.createdAt}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
