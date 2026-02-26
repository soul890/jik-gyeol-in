import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Eye, User, MessageCircle, Send } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { jobs } from '@/data/jobs';
import { categories } from '@/data/categories';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { db } from '@/lib/firebase';
import { formatDate } from '@/utils/format';

export function JobDetailPage() {
  const { id } = useParams();
  const job = jobs.find((j) => j.id === id);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
