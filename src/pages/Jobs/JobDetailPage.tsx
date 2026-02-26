import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Clock, Eye, User, MessageCircle, Send, X } from 'lucide-react';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { jobs as staticJobs } from '@/data/jobs';
import { categories } from '@/data/categories';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { db } from '@/lib/firebase';
import { formatDate } from '@/utils/format';
import type { Job } from '@/types';

export function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const staticMatch = staticJobs.find((j) => j.id === id);
    if (staticMatch) {
      setJob(staticMatch);
      setLoading(false);
      return;
    }

    if (!id) {
      setLoading(false);
      return;
    }

    getDoc(doc(db, 'jobs', id))
      .then((snap) => {
        if (snap.exists()) {
          setJob({ id: snap.id, ...snap.data() } as Job);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        jobId: job.id,
        jobTitle: job.title,
        name: inquiryForm.name,
        phone: inquiryForm.phone,
        message: inquiryForm.message,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowInquiryModal(false);
    setInquiryForm({ name: '', phone: '', message: '' });
    setSubmitted(false);
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
            <button
              onClick={() => setShowInquiryModal(true)}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              채팅으로 상담하기
            </button>
          </div>
        </CardContent>
      </Card>

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

      {/* 채팅 상담 모달 */}
      <Modal isOpen={showInquiryModal} onClose={handleCloseModal} title={`${job.title} 상담 문의`}>
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-warm-800 mb-2">상담 신청이 완료되었습니다</h4>
            <p className="text-sm text-warm-500 mb-6">담당자가 빠른 시일 내에 연락드리겠습니다.</p>
            <Button onClick={handleCloseModal} className="w-full">확인</Button>
          </div>
        ) : (
          <form onSubmit={handleInquirySubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">이름</label>
              <input
                type="text"
                required
                value={inquiryForm.name}
                onChange={(e) => setInquiryForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="홍길동"
                className="w-full px-3 py-2.5 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">연락처</label>
              <input
                type="tel"
                required
                value={inquiryForm.phone}
                onChange={(e) => setInquiryForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="010-0000-0000"
                className="w-full px-3 py-2.5 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">문의 내용</label>
              <textarea
                required
                rows={4}
                value={inquiryForm.message}
                onChange={(e) => setInquiryForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="상담 받고 싶은 내용을 자유롭게 작성해주세요."
                className="w-full px-3 py-2.5 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              {submitting ? '전송 중...' : '상담 신청하기'}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
