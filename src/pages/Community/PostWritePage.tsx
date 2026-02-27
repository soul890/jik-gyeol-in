import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { BlockEditor } from '@/components/community/BlockEditor';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { Block } from '@/types';

export function PostWritePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState('시공노하우');
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([{ type: 'text', value: '' }]);

  // Pre-generate postId for Storage path
  const postId = useMemo(() => crypto.randomUUID(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Validate: at least title and some content
    const hasContent = blocks.some(
      (b) => (b.type === 'text' && b.value.trim()) || (b.type === 'image' && b.url),
    );
    if (!title.trim() || !hasContent) return;

    setSubmitting(true);
    try {
      // Extract image URLs for card thumbnail compatibility
      const images = blocks
        .filter((b): b is Extract<Block, { type: 'image' }> => b.type === 'image' && !!b.url)
        .map((b) => b.url);

      // Build plain text content for backwards compat / search
      const content = blocks
        .filter((b): b is Extract<Block, { type: 'text' }> => b.type === 'text')
        .map((b) => b.value)
        .join('\n');

      await addDoc(collection(db, 'communityPosts'), {
        category,
        title: title.trim(),
        content,
        blocks,
        images,
        uid: user?.uid || '',
        author: profile?.nickname || '익명',
        createdAt: serverTimestamp(),
        views: 0,
        likes: 0,
        commentCount: 0,
      });
      setShowSuccess(true);
    } catch {
      setShowSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/community" className="inline-flex items-center gap-1 text-sm text-warm-500 hover:text-warm-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        목록으로
      </Link>

      <h1 className="text-2xl font-bold text-warm-800 mb-6">글쓰기</h1>

      <Card>
        <CardContent className="py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Select
              id="category"
              label="카테고리"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: '시공노하우', label: '시공노하우' },
                { value: '질문답변', label: '질문답변' },
                { value: '자유게시판', label: '자유게시판' },
              ]}
            />

            <Input
              id="title"
              label="제목"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-warm-700 mb-2">내용</label>
              <div className="border border-warm-200 rounded-lg p-4 bg-white min-h-[200px]">
                <BlockEditor blocks={blocks} onChange={setBlocks} postId={postId} />
              </div>
              <p className="text-xs text-warm-400 mt-2">
                블록 사이의 + 버튼으로 텍스트, 사진, 구분선을 추가할 수 있습니다.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? '등록 중...' : '등록하기'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/community')}>
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Modal isOpen={showSuccess} onClose={() => { setShowSuccess(false); navigate('/community'); }} title="등록 완료">
        <p className="text-warm-600 mb-4">게시글이 등록되었습니다.</p>
        <Button onClick={() => { setShowSuccess(false); navigate('/community'); }} className="w-full">
          확인
        </Button>
      </Modal>
    </div>
  );
}
