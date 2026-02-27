import { useState } from 'react';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { Star } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';

const REVIEW_TAGS = [
  '품질좋음',
  '가성비좋음',
  '친절함',
  '시공깔끔',
  '소통원활',
  '마감좋음',
  '시간준수',
  '추천',
];

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  companyName: string;
  onSuccess?: () => void;
}

export function ReviewFormModal({ isOpen, onClose, companyId, companyName, onSuccess }: ReviewFormModalProps) {
  const { profile } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = async () => {
    if (!rating || !title.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      const review = {
        id: crypto.randomUUID(),
        title: title.trim(),
        content: content.trim(),
        rating,
        author: profile?.nickname || '익명',
        date: new Date().toLocaleDateString('ko-KR'),
        tags: selectedTags,
      };
      await updateDoc(doc(db, 'companies', companyId), {
        reviews: arrayUnion(review),
        reviewCount: increment(1),
      });
      setSubmitted(true);
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    const wasSubmitted = submitted;
    setRating(0);
    setHoverRating(0);
    setTitle('');
    setContent('');
    setSelectedTags([]);
    setSubmitted(false);
    onClose();
    if (wasSubmitted && onSuccess) {
      onSuccess();
    }
  };

  const canSubmit = rating > 0 && title.trim().length > 0 && content.trim().length > 0;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="후기 작성">
      {submitted ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">&#10003;</span>
          </div>
          <p className="font-semibold text-warm-800 mb-1">후기가 등록되었습니다</p>
          <p className="text-sm text-warm-500">소중한 후기 감사합니다.</p>
          <Button onClick={handleClose} className="mt-4">확인</Button>
        </div>
      ) : (
        <div className="space-y-5">
          <p className="text-sm text-warm-600">
            <span className="font-semibold text-warm-800">{companyName}</span>에 대한 후기를 남겨주세요.
          </p>

          {/* 별점 */}
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-2">별점</label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => {
                const starValue = i + 1;
                const filled = starValue <= (hoverRating || rating);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5 cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${filled ? 'fill-amber-400 text-amber-400' : 'text-warm-200'}`}
                    />
                  </button>
                );
              })}
              {rating > 0 && (
                <span className="text-sm text-warm-500 ml-2">{rating}점</span>
              )}
            </div>
          </div>

          {/* 제목 */}
          <Input
            label="제목"
            placeholder="후기 제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
          />

          {/* 내용 */}
          <Textarea
            label="내용"
            placeholder="시공 경험을 자세히 알려주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />

          {/* 태그 선택 */}
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-2">태그 (선택)</label>
            <div className="flex flex-wrap gap-2">
              {REVIEW_TAGS.map((tag) => {
                const selected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors cursor-pointer ${
                      selected
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-warm-100 text-warm-600 border-warm-200 hover:border-warm-300'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="flex-1"
            >
              {submitting ? '등록 중...' : '후기 등록'}
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
