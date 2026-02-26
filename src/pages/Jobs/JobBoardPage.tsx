import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { jobs as staticJobs } from '@/data/jobs';
import { JobCard } from '@/components/common/JobCard';
import { CategoryFilter } from '@/components/common/CategoryFilter';
import { SearchBar } from '@/components/ui/SearchBar';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { db } from '@/lib/firebase';
import type { Job } from '@/types';

const ITEMS_PER_PAGE = 9;

const jobTabs = [
  { id: 'all', label: '전체' },
  { id: '구인', label: '구인' },
  { id: '구직', label: '구직' },
];

export function JobBoardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [firestoreJobs, setFirestoreJobs] = useState<Job[]>([]);

  useEffect(() => {
    getDocs(collection(db, 'jobs'))
      .then((snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[];
        setFirestoreJobs(docs);
      })
      .catch(() => {});
  }, []);

  const allJobs = useMemo(() => {
    const firestoreIds = new Set(firestoreJobs.map((d) => d.id));
    const uniqueStatic = staticJobs.filter((d) => !firestoreIds.has(d.id));
    return [...firestoreJobs, ...uniqueStatic];
  }, [firestoreJobs]);

  const filtered = useMemo(() => {
    return allJobs.filter((job) => {
      if (category !== 'all' && job.categoryId !== category) return false;
      if (tab !== 'all' && job.type !== tab) return false;
      if (search && !job.title.includes(search) && !job.description.includes(search)) return false;
      return true;
    });
  }, [allJobs, category, tab, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleCategoryChange = (id: string) => {
    setSearchParams(id === 'all' ? {} : { category: id });
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-warm-800">구인구직</h1>
          <p className="text-sm text-warm-500 mt-1">인테리어 일감을 찾거나 등록하세요</p>
        </div>
        <Link to="/jobs/new">
          <Button>
            <Plus className="w-4 h-4" />
            글쓰기
          </Button>
        </Link>
      </div>

      <div className="space-y-4 mb-6">
        <SearchBar
          placeholder="제목 또는 내용으로 검색..."
          onSearch={(v) => { setSearch(v); setPage(1); }}
        />
        <Tabs tabs={jobTabs} activeTab={tab} onChange={(t) => { setTab(t); setPage(1); }} />
        <CategoryFilter selected={category} onChange={handleCategoryChange} />
      </div>

      {paged.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {paged.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState title="등록된 글이 없습니다" description="검색 조건을 변경하거나 새 글을 작성해보세요." />
      )}
    </div>
  );
}
