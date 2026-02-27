import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle, Trash2, Eye, Users, FileText, Building2, Briefcase } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { db } from '@/lib/firebase';

interface Report {
  id: string;
  reporterUid: string;
  reporterEmail: string;
  targetType: string;
  targetId: string;
  targetTitle: string;
  reason: string;
  detail: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: { toDate: () => Date } | null;
}

interface UserInfo {
  id: string;
  nickname: string;
  email: string;
  role?: string;
  subscription?: { plan: string };
}

type TabId = 'reports' | 'users' | 'data';

const tabs = [
  { id: 'reports', label: '신고 관리' },
  { id: 'users', label: '사용자 관리' },
  { id: 'data', label: '데이터 관리' },
];

const statusLabel: Record<string, string> = {
  pending: '대기',
  resolved: '처리 완료',
  dismissed: '기각',
};

const statusVariant: Record<string, 'warning' | 'success' | 'default'> = {
  pending: 'warning',
  resolved: 'success',
  dismissed: 'default',
};

const typeIcon: Record<string, React.ElementType> = {
  job: Briefcase,
  company: Building2,
  supplier: Building2,
  post: FileText,
  user: Users,
};

export function AdminPage() {
  usePageTitle('관리자');
  const { profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('reports');
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [dataCounts, setDataCounts] = useState<Record<string, number>>({});
  const [clearingCollection, setClearingCollection] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.role !== 'admin') return;

    const fetchData = async () => {
      setLoading(true);
      const [reportSnap, userSnap] = await Promise.all([
        getDocs(query(collection(db, 'reports'), orderBy('createdAt', 'desc'))).catch(() => null),
        getDocs(collection(db, 'users')).catch(() => null),
      ]);

      if (reportSnap) {
        setReports(reportSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Report));
      }
      if (userSnap) {
        setUsers(userSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as UserInfo));
      }

      // 컬렉션별 데이터 수 조회
      const collections = ['jobs', 'companies', 'suppliers', 'communityPosts'];
      const counts: Record<string, number> = {};
      await Promise.all(
        collections.map(async (col) => {
          const snap = await getDocs(collection(db, col)).catch(() => null);
          counts[col] = snap?.size ?? 0;
        }),
      );
      setDataCounts(counts);

      setLoading(false);
    };

    fetchData();
  }, [profile?.role]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleReportAction = async (reportId: string, status: 'resolved' | 'dismissed') => {
    try {
      await updateDoc(doc(db, 'reports', reportId), { status });
      setReports((prev) => prev.map((r) => r.id === reportId ? { ...r, status } : r));
    } catch {
      // silently fail
    }
  };

  const handleDeleteContent = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const collectionMap: Record<string, string> = {
        job: 'jobs',
        company: 'companies',
        supplier: 'suppliers',
        post: 'communityPosts',
      };
      const col = collectionMap[deleteTarget.targetType];
      if (col) {
        await deleteDoc(doc(db, col, deleteTarget.targetId));
      }
      await updateDoc(doc(db, 'reports', deleteTarget.id), { status: 'resolved' });
      setReports((prev) => prev.map((r) => r.id === deleteTarget.id ? { ...r, status: 'resolved' as const } : r));
      setDeleteTarget(null);
    } catch {
      // silently fail
    } finally {
      setDeleting(false);
    }
  };

  const handleClearCollection = async (colName: string) => {
    if (!confirm(`"${colName}" 컬렉션의 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) return;
    setClearingCollection(colName);
    try {
      const snap = await getDocs(collection(db, colName));
      await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, colName, d.id))));
      setDataCounts((prev) => ({ ...prev, [colName]: 0 }));
    } catch {
      alert('삭제 실패. 권한을 확인해주세요.');
    } finally {
      setClearingCollection(null);
    }
  };

  const pendingCount = reports.filter((r) => r.status === 'pending').length;

  const tabsWithCount = tabs.map((t) => ({
    ...t,
    count: t.id === 'reports' ? pendingCount : users.length,
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-warm-800">관리자 대시보드</h1>
          <p className="text-sm text-warm-500">신고 관리 및 사용자 관리</p>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-red-500">{pendingCount}</p>
            <p className="text-xs text-warm-500">대기 중 신고</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-warm-700">{reports.length}</p>
            <p className="text-xs text-warm-500">전체 신고</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-primary-500">{users.length}</p>
            <p className="text-xs text-warm-500">전체 회원</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-emerald-500">
              {users.filter((u) => u.subscription?.plan && u.subscription.plan !== 'free').length}
            </p>
            <p className="text-xs text-warm-500">유료 구독자</p>
          </CardContent>
        </Card>
      </div>

      <Tabs tabs={tabsWithCount} activeTab={activeTab} onChange={(id) => setActiveTab(id as TabId)} className="mb-4" />

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* 신고 관리 */}
          {activeTab === 'reports' && (
            <div className="space-y-3">
              {reports.length === 0 ? (
                <div className="text-center py-12 text-warm-400">접수된 신고가 없습니다</div>
              ) : (
                reports.map((report) => {
                  const Icon = typeIcon[report.targetType] || AlertTriangle;
                  return (
                    <Card key={report.id}>
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <Icon className="w-4 h-4 text-warm-400 shrink-0" />
                              <Badge variant={statusVariant[report.status]}>{statusLabel[report.status]}</Badge>
                              <span className="text-xs text-warm-400">
                                {report.createdAt?.toDate?.().toLocaleDateString('ko-KR') || ''}
                              </span>
                            </div>
                            <p className="font-semibold text-warm-800 truncate">{report.targetTitle}</p>
                            <p className="text-sm text-warm-600 mt-1">
                              <span className="font-medium text-red-500">{report.reason}</span>
                              {report.detail && <span className="text-warm-400"> - {report.detail}</span>}
                            </p>
                            <p className="text-xs text-warm-400 mt-1">신고자: {report.reporterEmail}</p>
                          </div>

                          {report.status === 'pending' && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => setDeleteTarget(report)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="콘텐츠 삭제"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReportAction(report.id, 'resolved')}
                                className="p-2 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                title="처리 완료"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReportAction(report.id, 'dismissed')}
                                className="p-2 text-warm-300 hover:text-warm-500 hover:bg-warm-100 rounded-lg transition-colors cursor-pointer"
                                title="기각"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}

          {/* 데이터 관리 */}
          {activeTab === 'data' && (
            <div className="space-y-3">
              <Card>
                <CardContent className="py-4">
                  <p className="text-sm text-warm-500 mb-4">
                    각 컬렉션의 모든 데이터를 삭제합니다. 삭제 후 복구할 수 없으니 주의하세요.
                  </p>
                  {[
                    { col: 'jobs', label: '구인구직' },
                    { col: 'companies', label: '인테리어 업체' },
                    { col: 'suppliers', label: '자재업체' },
                    { col: 'communityPosts', label: '커뮤니티 게시글' },
                  ].map(({ col, label }) => (
                    <div key={col} className="flex items-center justify-between py-3 border-b border-warm-100 last:border-0">
                      <div>
                        <p className="font-medium text-warm-800">{label}</p>
                        <p className="text-xs text-warm-400">{col} · {dataCounts[col] ?? 0}개</p>
                      </div>
                      <Button
                        onClick={() => handleClearCollection(col)}
                        disabled={clearingCollection === col || (dataCounts[col] ?? 0) === 0}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {clearingCollection === col ? '삭제 중...' : '전체 삭제'}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* 사용자 관리 */}
          {activeTab === 'users' && (
            <div className="space-y-2">
              {users.map((u) => (
                <Card key={u.id}>
                  <CardContent className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-warm-800">{u.nickname || '이름 없음'}</p>
                          {u.role === 'admin' && <Badge variant="warning">관리자</Badge>}
                          {u.subscription?.plan && u.subscription.plan !== 'free' && (
                            <Badge variant="primary">{u.subscription.plan}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-warm-400">{u.email}</p>
                      </div>
                      <p className="text-xs text-warm-300 font-mono shrink-0">{u.id.slice(0, 8)}...</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* 콘텐츠 삭제 확인 모달 */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="콘텐츠 삭제">
        <div className="space-y-4">
          <p className="text-warm-600">
            신고된 콘텐츠 "<strong className="text-warm-800">{deleteTarget?.targetTitle}</strong>"을(를) 삭제하시겠습니까?
          </p>
          <p className="text-sm text-warm-400">삭제 후 신고는 '처리 완료'로 변경됩니다.</p>
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleDeleteContent}
              disabled={deleting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting ? '삭제 중...' : '삭제 및 처리'}
            </Button>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>취소</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
