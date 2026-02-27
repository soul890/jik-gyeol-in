import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';

const REPORT_REASONS = [
  '스팸/광고',
  '허위 정보',
  '욕설/비방',
  '개인정보 노출',
  '부적절한 콘텐츠',
  '기타',
];

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'job' | 'company' | 'supplier' | 'post' | 'user';
  targetId: string;
  targetTitle: string;
}

export function ReportModal({ isOpen, onClose, targetType, targetId, targetTitle }: ReportModalProps) {
  const { user } = useAuth();
  const [reason, setReason] = useState('');
  const [detail, setDetail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!reason || !user) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'reports'), {
        reporterUid: user.uid,
        reporterEmail: user.email,
        targetType,
        targetId,
        targetTitle,
        reason,
        detail: detail.trim(),
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setDetail('');
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="신고하기">
      {submitted ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">&#10003;</span>
          </div>
          <p className="font-semibold text-warm-800 mb-1">신고가 접수되었습니다</p>
          <p className="text-sm text-warm-500">검토 후 조치하겠습니다. 감사합니다.</p>
          <Button onClick={handleClose} className="mt-4">확인</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-warm-600">
            "<span className="font-semibold text-warm-800">{targetTitle}</span>" 신고 사유를 선택해주세요.
          </p>

          <div className="space-y-2">
            {REPORT_REASONS.map((r) => (
              <label key={r} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="report-reason"
                  value={r}
                  checked={reason === r}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-4 h-4 text-primary-500 focus:ring-primary-500 cursor-pointer"
                />
                <span className="text-sm text-warm-700">{r}</span>
              </label>
            ))}
          </div>

          <Textarea
            id="report-detail"
            label="상세 내용 (선택)"
            placeholder="구체적인 사유를 입력해주세요"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            rows={3}
          />

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={!reason || submitting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {submitting ? '접수 중...' : '신고 접수'}
            </Button>
            <Button variant="outline" onClick={handleClose}>
              취소
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
