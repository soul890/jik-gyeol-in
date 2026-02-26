import { communityPosts } from '@/data/communityPosts';
import { CommunityPostCard } from '@/components/common/CommunityPostCard';
import { SectionHeader } from '@/components/common/SectionHeader';

export function RecentCommunity() {
  const recentPosts = communityPosts.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <SectionHeader
        title="커뮤니티"
        subtitle="시공 노하우와 질문을 나눠보세요"
        linkTo="/community"
        linkText="전체보기"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recentPosts.map((post) => (
          <CommunityPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
