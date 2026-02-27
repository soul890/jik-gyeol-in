import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, MapPin, Mail, Pencil, Briefcase, Building2, Package, FileText,
  Crown, LogOut, Trash2, Eye, MessageSquare, Heart, Shield,
} from 'lucide-react';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { Card, CardContent } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { db } from '@/lib/firebase';
import { usePageTitle } from '@/hooks/usePageTitle';
import { formatDate } from '@/utils/format';
import type { Job, Company, Supplier, CommunityPost } from '@/types';

type TabId = 'jobs' | 'companies' | 'suppliers' | 'posts';

const tabs = [
  { id: 'jobs', label: '구인구직', icon: Briefcase },
  { id: 'companies', label: '업체', icon: Building2 },
  { id: 'suppliers', label: '자재업체', icon: Package },
  { id: 'posts', label: '게시글', icon: FileText },
];

export function MyPage() {
  const navigate = useNavigate();
  usePageTitle('마이페이지');
  const { user, profile, refreshProfile, logout } = useAuth();
  const { isPro, isBusiness } = useSubscription();
  const [activeTab, setActiveTab] = useState<TabId>('jobs');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handlePasswordChange = async () => {
    setPasswordError('');
    if (newPassword.length < 6) {
      setPasswordError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    setPasswordSaving(true);
    try {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordError('현재 비밀번호가 올바르지 않습니다.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const collectionMap: Record<string, string> = {
        job: 'jobs',
        company: 'companies',
        supplier: 'suppliers',
        post: 'communityPosts',
      };
      await deleteDoc(doc(db, collectionMap[deleteTarget.type], deleteTarget.id));
      if (deleteTarget.type === 'job') setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
      if (deleteTarget.type === 'company') setCompanies((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      if (deleteTarget.type === 'supplier') setSuppliers((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      if (deleteTarget.type === 'post') setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      // silently fail
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const planLabel = isBusiness ? 'Business' : isPro ? 'Pro' : '무료';
  const planVariant = isBusiness ? 'accent' : isPro ? 'primary' : 'default';

  const tabsWithCount = tabs.map((t) => {
    const countMap: Record<TabId, number> = {
      jobs: jobs.length,
      companies: companies.length,
      suppliers: suppliers.length,
      posts: posts.length,
    };
    return { ...t, count: countMap[t.id as TabId] };
  });

  const isEmailProvider = user.providerData.some((p) => p.providerId === 'password');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-warm-800 mb-6">마이페이지</h1>

      {/* 프로필 섹션 */}
      <Card className="mb-4">
        <CardContent className="py-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-primary-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-warm-800">{profile?.nickname || '사용자'}</h2>
                  <Badge variant={planVariant as 'default' | 'primary' | 'accent'}>
                    <Crown className="w-3 h-3 mr-1" />
                    {planLabel}
                  </Badge>
                </div>
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
            <div className="flex items-center gap-1 text-sm text-warm-500 mb-3">
              <MapPin className="w-3.5 h-3.5" />
              {profile.address}
            </div>
          )}

          {/* 구독 정보 */}
          {(isPro || isBusiness) && profile?.subscription && (
            <div className="mt-3 pt-3 border-t border-warm-100">
              <p className="text-xs text-warm-400">
                구독 만료일: {formatDate(profile.subscription.endDate)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 계정 관리 */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-2">
            {!isPro && (
              <Link to="/pricing">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Crown className="w-3.5 h-3.5" />
                  구독 업그레이드
                </Button>
              </Link>
            )}
            {isEmailProvider && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setPasswordError('');
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setShowPasswordModal(true);
                }}
                className="gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                비밀번호 변경
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={handleLogout} className="gap-1.5 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300">
              <LogOut className="w-3.5 h-3.5" />
              로그아웃
            </Button>
          </div>
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
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <Link to={`/jobs/${job.id}`} className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={job.type === '구인' ? 'primary' : 'accent'}>{job.type}</Badge>
                          {job.isUrgent && <Badge variant="warning">급구</Badge>}
                          <span className="text-xs text-warm-400">{formatDate(job.createdAt)}</span>
                        </div>
                        <h3 className="font-semibold text-warm-800 truncate">{job.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-warm-400">
                          <span>{job.location}</span>
                          <span>{job.pay}</span>
                          <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{job.views}</span>
                        </div>
                      </Link>
                      <button
                        onClick={() => setDeleteTarget({ type: 'job', id: job.id, title: job.title })}
                        className="ml-2 p-1.5 text-warm-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )
          )}

          {activeTab === 'companies' && (
            companies.length === 0 ? (
              <EmptyState title="등록한 업체가 없습니다" description="인테리어 업체를 등록해보세요." />
            ) : (
              companies.map((company) => (
                <Card key={company.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <Link to={`/companies/${company.id}`} className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="w-4 h-4 text-warm-400" />
                          <span className="text-xs text-warm-400">{formatDate(company.createdAt)}</span>
                        </div>
                        <h3 className="font-semibold text-warm-800 truncate">{company.name}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-warm-400">
                          <span>{company.location}</span>
                          <span>리뷰 {company.reviewCount}개</span>
                        </div>
                      </Link>
                      <button
                        onClick={() => setDeleteTarget({ type: 'company', id: company.id, title: company.name })}
                        className="ml-2 p-1.5 text-warm-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )
          )}

          {activeTab === 'suppliers' && (
            suppliers.length === 0 ? (
              <EmptyState title="등록한 자재업체가 없습니다" description="자재업체를 등록해보세요." />
            ) : (
              suppliers.map((supplier) => (
                <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <Link to={`/suppliers/${supplier.id}`} className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="w-4 h-4 text-warm-400" />
                          <span className="text-xs text-warm-400">{formatDate(supplier.createdAt)}</span>
                        </div>
                        <h3 className="font-semibold text-warm-800 truncate">{supplier.name}</h3>
                        <p className="text-xs text-warm-400 mt-1">{supplier.location}</p>
                      </Link>
                      <button
                        onClick={() => setDeleteTarget({ type: 'supplier', id: supplier.id, title: supplier.name })}
                        className="ml-2 p-1.5 text-warm-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )
          )}

          {activeTab === 'posts' && (
            posts.length === 0 ? (
              <EmptyState title="작성한 게시글이 없습니다" description="커뮤니티에서 글을 작성해보세요." />
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <Link to={`/community/${post.id}`} className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge>{post.category}</Badge>
                          <span className="text-xs text-warm-400">{formatDate(post.createdAt)}</span>
                        </div>
                        <h3 className="font-semibold text-warm-800 truncate">{post.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-warm-400">
                          <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{post.views}</span>
                          <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" />{post.likes}</span>
                          <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" />{post.commentCount}</span>
                        </div>
                      </Link>
                      <button
                        onClick={() => setDeleteTarget({ type: 'post', id: post.id, title: post.title })}
                        className="ml-2 p-1.5 text-warm-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
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

      {/* 비밀번호 변경 모달 */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="비밀번호 변경">
        <div className="space-y-4">
          <Input
            id="current-password"
            label="현재 비밀번호"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            id="new-password"
            label="새 비밀번호"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            id="confirm-password"
            label="새 비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
          <div className="flex gap-3 pt-2">
            <Button onClick={handlePasswordChange} className="flex-1" disabled={passwordSaving}>
              {passwordSaving ? '변경 중...' : '비밀번호 변경'}
            </Button>
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
              취소
            </Button>
          </div>
        </div>
      </Modal>

      {/* 삭제 확인 모달 */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="삭제 확인">
        <div className="space-y-4">
          <p className="text-warm-600">
            <strong className="text-warm-800">"{deleteTarget?.title}"</strong>을(를) 정말 삭제하시겠습니까?
          </p>
          <p className="text-sm text-warm-400">삭제된 항목은 복구할 수 없습니다.</p>
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting ? '삭제 중...' : '삭제'}
            </Button>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              취소
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
