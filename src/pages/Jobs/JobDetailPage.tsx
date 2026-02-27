import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Clock, Eye, User, MessageCircle, X, Flag } from 'lucide-react';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { categories } from '@/data/categories';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPromptModal } from '@/components/LoginPromptModal';
import { ReportModal } from '@/components/ReportModal';
import { findOrCreateChatRoom } from '@/utils/chat';
import { formatDate } from '@/utils/format';
import type { Job } from '@/types';

export function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [job, setJob] = useState<Job | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'jobs', id);
    getDoc(docRef)
      .then((snap) => {
        if (snap.exists()) {
          setJob({ id: snap.id, ...snap.data() } as Job);
          updateDoc(docRef, { views: increment(1) }).catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const isOwnListing = !!user && !!job?.uid && job.uid === user.uid;

  const handleStartChat = async () => {
    if (!job) return;
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setChatLoading(true);
    try {
      const roomId = await findOrCreateChatRoom({
        currentUserId: user.uid,
        currentUserName: profile?.nickname || user.email || '사용자',
        otherUserId: job.uid || `listing-job-${job.id}`,
        otherUserName: job.author,
        context: { type: 'job', id: job.id, title: job.title },
      });
      navigate(`/chat/${roomId}`);
    } catch {
      // silently fail
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-warm-700 mb-4">게시글을 찾을 수 없습니다</h2>
        <Link to="/jobs">
          <Button variant="outline">목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  const category = categories.find((c) => c.id === job.categoryId);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-warm-500 hover:text-warm-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        목록으로
      </Link>

      <Card>
        <CardContent className="py-6">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge variant={job.type === '구인' ? 'primary' : 'accent'}>{job.type}</Badge>
            {job.isUrgent && <Badge variant="warning">급구</Badge>}
            {category && <Badge>{category.name}</Badge>}
          </div>

          <h1 className="text-2xl font-bold text-warm-800 mb-4">{job.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-warm-500 mb-6 pb-6 border-b border-warm-200">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {job.author}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDate(job.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              조회 {job.views}
            </span>
          </div>

          <div className="mb-6">
            <div className="inline-block px-4 py-2 bg-primary-50 rounded-lg mb-6">
              <span className="text-sm text-warm-500">급여/단가</span>
              <p className="text-lg font-bold text-primary-700">{job.pay}</p>
            </div>

            <div className="prose prose-warm max-w-none">
              {job.description.split('\n').map((line, i) => (
                <p key={i} className="text-warm-700 leading-relaxed mb-1">
                  {line || <br />}
                </p>
              ))}
            </div>
          </div>

          {job.images && job.images.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-warm-800 mb-3">첨부 사진</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {job.images.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxUrl(url)}
                    className="aspect-[4/3] rounded-lg overflow-hidden border border-warm-200 cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={url}
                      alt={`첨부 사진 ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-warm-200">
            {isOwnListing ? (
              <div className="text-center text-sm text-warm-400 py-3">내가 작성한 글입니다</div>
            ) : (
              <button
                onClick={handleStartChat}
                disabled={chatLoading}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-5 h-5" />
                {chatLoading ? '채팅방 연결 중...' : '채팅으로 상담하기'}
              </button>
            )}
            {user && (
              <button
                onClick={() => setShowReport(true)}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 text-sm text-warm-400 hover:text-red-500 transition-colors cursor-pointer mt-2"
              >
                <Flag className="w-3.5 h-3.5" />
                신고하기
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {job && (
        <ReportModal
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          targetType="job"
          targetId={job.id}
          targetTitle={job.title}
        />
      )}

      {/* 이미지 라이트박스 */}
      {lightboxUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setLightboxUrl(null)}>
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxUrl}
            alt="첨부 사진"
            className="max-w-full max-h-[85vh] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <LoginPromptModal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
    </div>
  );
}
