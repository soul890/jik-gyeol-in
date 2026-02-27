import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenSquare } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { CommunityPostCard } from '@/components/common/CommunityPostCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { db } from '@/lib/firebase';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { CommunityCategory, CommunityPost } from '@/types';

const communityTabs = [
  { id: 'all', label: '전체' },
  { id: '시공노하우', label: '시공노하우' },
  { id: '질문답변', label: '질문답변' },
  { id: '자유게시판', label: '자유게시판' },
];

export function CommunityPage() {
  usePageTitle('커뮤니티');
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
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

  const allPosts = firestorePosts;

  const filtered = useMemo(() => {
    return allPosts.filter((post) => {
      if (tab !== 'all' && post.category !== (tab as CommunityCategory)) return false;
      if (search && !post.title.includes(search) && !post.content.includes(search)) return false;
      return true;
    });
  }, [allPosts, tab, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-warm-800">커뮤니티</h1>
          <p className="text-sm text-warm-500 mt-1">인테리어 노하우와 정보를 나눠보세요</p>
        </div>
        <Link to="/community/write">
          <Button>
            <PenSquare className="w-4 h-4" />
            글쓰기
          </Button>
        </Link>
      </div>

      <div className="space-y-4 mb-6">
        <SearchBar placeholder="제목 또는 내용으로 검색..." onSearch={setSearch} />
        <Tabs tabs={communityTabs} activeTab={tab} onChange={setTab} />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((post) => (
            <CommunityPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState title="게시글이 없습니다" description="검색 조건을 변경하거나 새 글을 작성해보세요." />
      )}
    </div>
  );
}
