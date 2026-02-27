import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { BlockEditor } from '@/components/community/BlockEditor';
import { categories } from '@/data/categories';
import { Modal } from '@/components/ui/Modal';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { Block } from '@/types';

export function JobPostForm() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: '구인',
    categoryId: '',
    title: '',
    location: '',
    pay: '',
    contact: '',
  });
  const [blocks, setBlocks] = useState<Block[]>([{ type: 'text', value: '' }]);
  const jobId = useMemo(() => crypto.randomUUID(), []);

  const categoryOptions = [
    { value: '', label: '공정을 선택하세요' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const images = blocks
        .filter((b): b is Extract<Block, { type: 'image' }> => b.type === 'image' && !!b.url)
        .map((b) => b.url);
      const description = blocks
        .filter((b): b is Extract<Block, { type: 'text' }> => b.type === 'text')
        .map((b) => b.value)
        .join('\n');

      await addDoc(collection(db, 'jobs'), {
        ...formData,
        description,
        blocks,
        images,
        uid: user?.uid || '',
        author: profile?.nickname || '익명',
        createdAt: serverTimestamp(),
        views: 0,
        isUrgent: false,
        commentCount: 0,
      });
      setShowSuccess(true);
    } catch {
      setShowSuccess(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-warm-500 hover:text-warm-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        목록으로
      </Link>

      <h1 className="text-2xl font-bold text-warm-800 mb-6">구인구직 글쓰기</h1>

      <Card>
        <CardContent className="py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Select
              id="type"
              label="유형"
              value={formData.type}
              onChange={(e) => setFormData((f) => ({ ...f, type: e.target.value }))}
              options={[
                { value: '구인', label: '구인 (사람을 찾습니다)' },
                { value: '구직', label: '구직 (일을 찾습니다)' },
              ]}
            />

            <Select
              id="category"
              label="공정"
              value={formData.categoryId}
              onChange={(e) => setFormData((f) => ({ ...f, categoryId: e.target.value }))}
              options={categoryOptions}
            />

            <Input
              id="title"
              label="제목"
              placeholder="제목을 입력하세요"
              value={formData.title}
              onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
            />

            <Input
              id="location"
              label="지역"
              placeholder="예: 서울 강남구"
              value={formData.location}
              onChange={(e) => setFormData((f) => ({ ...f, location: e.target.value }))}
            />

            <Input
              id="pay"
              label="급여/단가"
              placeholder="예: 일 35만원, 건당 200만원"
              value={formData.pay}
              onChange={(e) => setFormData((f) => ({ ...f, pay: e.target.value }))}
            />

            <div>
              <label className="block text-sm font-medium text-warm-700 mb-2">상세 내용</label>
              <div className="border border-warm-200 rounded-lg p-4 bg-white min-h-[200px]">
                <BlockEditor blocks={blocks} onChange={setBlocks} storagePath={`jobs/${jobId}/images`} />
              </div>
              <p className="text-xs text-warm-400 mt-2">
                블록 사이의 + 버튼으로 텍스트, 사진, 구분선을 추가할 수 있습니다.
              </p>
            </div>

            <Input
              id="contact"
              label="연락처"
              placeholder="전화번호 또는 이메일"
              value={formData.contact}
              onChange={(e) => setFormData((f) => ({ ...f, contact: e.target.value }))}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">등록하기</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/jobs')}>
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Modal isOpen={showSuccess} onClose={() => { setShowSuccess(false); navigate('/jobs'); }} title="등록 완료">
        <p className="text-warm-600 mb-4">게시글이 등록되었습니다.</p>
        <Button onClick={() => { setShowSuccess(false); navigate('/jobs'); }} className="w-full">
          확인
        </Button>
      </Modal>
    </div>
  );
}
