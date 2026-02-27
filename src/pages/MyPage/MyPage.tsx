import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, MapPin, Mail, Pencil, Briefcase, Building2, Package, FileText } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { formatDate } from '@/utils/format';
import type { Job, Company, Supplier, CommunityPost } from '@/types';

type TabId = 'jobs' | 'companies' | 'suppliers' | 'posts';

const tabs = [
  { id: 'jobs', label: '구인구직' },
  { id: 'companies', label: '업체' },
  { id: 'suppliers', label: '자재업체' },
  { id: 'posts', label: '게시글' },
];

export function MyPage() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('jobs');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [saving, setSaving] = useState(false);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    const uid = user.uid;
    const fetchAll = async () => {
      const [jobSnap, companySnap, supplierSnap, postSnap] = await Promise.all([
        getDocs(query(collection(db, 'jobs'), where('uid', '==', uid))),
        getDocs(query(collection(db, 'companies'), where('uid', '==', uid))),
        getDocs(query(collection(db, 'suppliers'), where('uid', '==', uid))),
        getDocs(query(collection(db, 'communityPosts'), where('uid', '==', uid))),
      ]);
      setJobs(jobSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Job));
      setCompanies(companySnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Company));
      setSuppliers(supplierSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Supplier));
      setPosts(postSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as CommunityPost));
      setLoading(false);
    };

    fetchAll().catch(() => setLoading(false));
  }, [user]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleEditOpen = () => {
    setEditNickname(profile?.nickname || '');
    setEditAddress(profile?.address || '');
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        nickname: editNickname,
        address: editAddress,
      });
      await refreshProfile();
      setShowEditModal(false);
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  const tabsWithCount = tabs.map((t) => {
    const countMap: Record<TabId, number> = {
      jobs: jobs.length,
      companies: companies.length,
      suppliers: suppliers.length,
      posts: posts.length,
    };
    return { ...t, count: countMap[t.id as TabId] };
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-warm-800 mb-6">마이페이지</h1>

      {/* 프로필 섹션 */}
      <Card className="mb-6">
        <CardContent className="py-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-warm-800">{profile?.nickname || '사용자'}</h2>
                <div className="flex items-center gap-1 text-sm text-warm-500">
                  <Mail className="w-3.5 h-3.5" />
                  {profile?.email || user.email}
                </div>
              </div>
            </div>
            <button
              onClick={handleEditOpen}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-warm-500 hover:text-warm-700 hover:bg-warm-100 rounded-lg transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              수정
            </button>
          </div>
          {profile?.address && (
            <div className="flex items-center gap-1 text-sm text-warm-500">
              <MapPin className="w-3.5 h-3.5" />
              {profile.address}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 내 콘텐츠 탭 */}
      <Tabs
        tabs={tabsWithCount}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
        className="mb-4"
      />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {activeTab === 'jobs' && (
            jobs.length === 0 ? (
              <EmptyState title="작성한 구인구직 글이 없습니다" description="구인구직 게시판에서 글을 작성해보세요." />
            ) : (
              jobs.map((job) => (
                <Link key={job.id} to={`/jobs/${job.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className="w-4 h-4 text-warm-400" />
                        <Badge variant={job.type === '구인' ? 'primary' : 'accent'}>{job.type}</Badge>
                        <span className="text-xs text-warm-400">{formatDate(job.createdAt)}</span>
                      </div>
                      <h3 className="font-semibold text-warm-800">{job.title}</h3>
                      <p className="text-sm text-warm-500">{job.location} · {job.pay}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )
          )}

          {activeTab === 'companies' && (
            companies.length === 0 ? (
              <EmptyState title="등록한 업체가 없습니다" description="인테리어 업체를 등록해보세요." />
            ) : (
              companies.map((company) => (
                <Link key={company.id} to={`/companies/${company.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-warm-400" />
                        <span className="text-xs text-warm-400">{company.createdAt}</span>
                      </div>
                      <h3 className="font-semibold text-warm-800">{company.name}</h3>
                      <p className="text-sm text-warm-500">{company.location}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )
          )}

          {activeTab === 'suppliers' && (
            suppliers.length === 0 ? (
              <EmptyState title="등록한 자재업체가 없습니다" description="자재업체를 등록해보세요." />
            ) : (
              suppliers.map((supplier) => (
                <Link key={supplier.id} to={`/suppliers/${supplier.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-warm-400" />
                        <span className="text-xs text-warm-400">{supplier.createdAt}</span>
                      </div>
                      <h3 className="font-semibold text-warm-800">{supplier.name}</h3>
                      <p className="text-sm text-warm-500">{supplier.location}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )
          )}

          {activeTab === 'posts' && (
            posts.length === 0 ? (
              <EmptyState title="작성한 게시글이 없습니다" description="커뮤니티에서 글을 작성해보세요." />
            ) : (
              posts.map((post) => (
                <Link key={post.id} to={`/community/${post.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-warm-400" />
                        <Badge>{post.category}</Badge>
                        <span className="text-xs text-warm-400">{formatDate(post.createdAt)}</span>
                      </div>
                      <h3 className="font-semibold text-warm-800">{post.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )
          )}
        </div>
      )}

      {/* 프로필 수정 모달 */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="프로필 수정">
        <div className="space-y-4">
          <Input
            id="edit-nickname"
            label="닉네임"
            value={editNickname}
            onChange={(e) => setEditNickname(e.target.value)}
          />
          <Input
            id="edit-address"
            label="주소"
            value={editAddress}
            onChange={(e) => setEditAddress(e.target.value)}
          />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleEditSave} className="flex-1" disabled={saving}>
              {saving ? '저장 중...' : '저장'}
            </Button>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              취소
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
