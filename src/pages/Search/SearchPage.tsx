import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Briefcase, Building2, Package, FileText } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { db } from '@/lib/firebase';
import { usePageTitle } from '@/hooks/usePageTitle';
import { formatDate } from '@/utils/format';
import { jobs as staticJobs } from '@/data/jobs';
import { companies as staticCompanies } from '@/data/companies';
import { suppliers as staticSuppliers } from '@/data/suppliers';
import { communityPosts as staticPosts } from '@/data/communityPosts';
import type { Job, Company, Supplier, CommunityPost } from '@/types';

type TabId = 'all' | 'jobs' | 'companies' | 'suppliers' | 'posts';

function matchQuery(text: string, query: string) {
  return text.toLowerCase().includes(query.toLowerCase());
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  usePageTitle(q ? `"${q}" 검색 결과` : '검색');
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [inputValue, setInputValue] = useState(q);
  const [loading, setLoading] = useState(true);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    setInputValue(q);
    if (!q) {
      setJobs([]);
      setCompanies([]);
      setSuppliers([]);
      setPosts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchAll = async () => {
      const [jobSnap, companySnap, supplierSnap, postSnap] = await Promise.all([
        getDocs(collection(db, 'jobs')).catch(() => null),
        getDocs(collection(db, 'companies')).catch(() => null),
        getDocs(collection(db, 'suppliers')).catch(() => null),
        getDocs(collection(db, 'communityPosts')).catch(() => null),
      ]);

      const jobIds = new Set<string>();
      const allJobs: Job[] = [];
      jobSnap?.docs.forEach((d) => {
        jobIds.add(d.id);
        allJobs.push({ id: d.id, ...d.data() } as Job);
      });
      staticJobs.forEach((j) => { if (!jobIds.has(j.id)) allJobs.push(j); });

      const companyIds = new Set<string>();
      const allCompanies: Company[] = [];
      companySnap?.docs.forEach((d) => {
        companyIds.add(d.id);
        allCompanies.push({ id: d.id, ...d.data() } as Company);
      });
      staticCompanies.forEach((c) => { if (!companyIds.has(c.id)) allCompanies.push(c); });

      const supplierIds = new Set<string>();
      const allSuppliers: Supplier[] = [];
      supplierSnap?.docs.forEach((d) => {
        supplierIds.add(d.id);
        allSuppliers.push({ id: d.id, ...d.data() } as Supplier);
      });
      staticSuppliers.forEach((s) => { if (!supplierIds.has(s.id)) allSuppliers.push(s); });

      const postIds = new Set<string>();
      const allPosts: CommunityPost[] = [];
      postSnap?.docs.forEach((d) => {
        postIds.add(d.id);
        allPosts.push({ id: d.id, ...d.data() } as CommunityPost);
      });
      staticPosts.forEach((p) => { if (!postIds.has(p.id)) allPosts.push(p); });

      setJobs(allJobs.filter((j) => matchQuery(j.title, q) || matchQuery(j.description, q) || matchQuery(j.location, q)));
      setCompanies(allCompanies.filter((c) => matchQuery(c.name, q) || matchQuery(c.description, q) || matchQuery(c.location, q)));
      setSuppliers(allSuppliers.filter((s) => matchQuery(s.name, q) || matchQuery(s.description, q) || matchQuery(s.location, q)));
      setPosts(allPosts.filter((p) => matchQuery(p.title, q) || matchQuery(p.content, q)));
      setLoading(false);
    };

    fetchAll();
  }, [q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      setSearchParams({ q: trimmed });
      setActiveTab('all');
    }
  };

  const totalCount = jobs.length + companies.length + suppliers.length + posts.length;

  const tabList = [
    { id: 'all', label: '전체', count: totalCount },
    { id: 'jobs', label: '구인구직', count: jobs.length },
    { id: 'companies', label: '업체', count: companies.length },
    { id: 'suppliers', label: '자재업체', count: suppliers.length },
    { id: 'posts', label: '커뮤니티', count: posts.length },
  ];

  const showJobs = activeTab === 'all' || activeTab === 'jobs';
  const showCompanies = activeTab === 'all' || activeTab === 'companies';
  const showSuppliers = activeTab === 'all' || activeTab === 'suppliers';
  const showPosts = activeTab === 'all' || activeTab === 'posts';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* 검색 입력 */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="업체, 구인구직, 커뮤니티 통합 검색"
            className="w-full pl-12 pr-4 py-3.5 text-base border border-warm-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
            autoFocus
          />
        </div>
      </form>

      {!q ? (
        <div className="text-center py-16 text-warm-400">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>검색어를 입력해주세요</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <p className="text-sm text-warm-500 mb-4">
            "<span className="font-semibold text-warm-700">{q}</span>" 검색 결과 총 <span className="font-semibold text-warm-700">{totalCount}</span>건
          </p>

          <Tabs
            tabs={tabList}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as TabId)}
            className="mb-6"
          />

          {totalCount === 0 ? (
            <EmptyState title="검색 결과가 없습니다" description="다른 검색어를 시도해보세요." />
          ) : (
            <div className="space-y-6">
              {/* 구인구직 결과 */}
              {showJobs && jobs.length > 0 && (
                <section>
                  {activeTab === 'all' && (
                    <h2 className="flex items-center gap-2 text-lg font-bold text-warm-800 mb-3">
                      <Briefcase className="w-5 h-5 text-primary-500" />
                      구인구직 ({jobs.length})
                    </h2>
                  )}
                  <div className="space-y-2">
                    {jobs.map((job) => (
                      <Link key={job.id} to={`/jobs/${job.id}`}>
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="py-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={job.type === '구인' ? 'primary' : 'accent'}>{job.type}</Badge>
                              {job.isUrgent && <Badge variant="warning">급구</Badge>}
                              <span className="text-xs text-warm-400">{formatDate(job.createdAt)}</span>
                            </div>
                            <h3 className="font-semibold text-warm-800">{job.title}</h3>
                            <p className="text-sm text-warm-500 mt-0.5">{job.location} · {job.pay}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* 업체 결과 */}
              {showCompanies && companies.length > 0 && (
                <section>
                  {activeTab === 'all' && (
                    <h2 className="flex items-center gap-2 text-lg font-bold text-warm-800 mb-3">
                      <Building2 className="w-5 h-5 text-primary-500" />
                      인테리어 업체 ({companies.length})
                    </h2>
                  )}
                  <div className="space-y-2">
                    {companies.map((company) => (
                      <Link key={company.id} to={`/companies/${company.id}`}>
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="py-3">
                            <h3 className="font-semibold text-warm-800">{company.name}</h3>
                            <p className="text-sm text-warm-500 mt-0.5">{company.location} · 리뷰 {company.reviewCount}건</p>
                            <p className="text-sm text-warm-400 mt-1 line-clamp-1">{company.description}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* 자재업체 결과 */}
              {showSuppliers && suppliers.length > 0 && (
                <section>
                  {activeTab === 'all' && (
                    <h2 className="flex items-center gap-2 text-lg font-bold text-warm-800 mb-3">
                      <Package className="w-5 h-5 text-primary-500" />
                      자재업체 ({suppliers.length})
                    </h2>
                  )}
                  <div className="space-y-2">
                    {suppliers.map((supplier) => (
                      <Link key={supplier.id} to={`/suppliers/${supplier.id}`}>
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="py-3">
                            <h3 className="font-semibold text-warm-800">{supplier.name}</h3>
                            <p className="text-sm text-warm-500 mt-0.5">{supplier.location}</p>
                            <p className="text-sm text-warm-400 mt-1 line-clamp-1">{supplier.description}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* 커뮤니티 결과 */}
              {showPosts && posts.length > 0 && (
                <section>
                  {activeTab === 'all' && (
                    <h2 className="flex items-center gap-2 text-lg font-bold text-warm-800 mb-3">
                      <FileText className="w-5 h-5 text-primary-500" />
                      커뮤니티 ({posts.length})
                    </h2>
                  )}
                  <div className="space-y-2">
                    {posts.map((post) => (
                      <Link key={post.id} to={`/community/${post.id}`}>
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="py-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge>{post.category}</Badge>
                              <span className="text-xs text-warm-400">{formatDate(post.createdAt)}</span>
                            </div>
                            <h3 className="font-semibold text-warm-800">{post.title}</h3>
                            <p className="text-sm text-warm-400 mt-1 line-clamp-1">{post.content}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
