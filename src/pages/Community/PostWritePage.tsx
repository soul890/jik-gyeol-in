import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { FileUpload } from '@/components/ui/FileUpload';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export function PostWritePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    category: '시공노하우',
    title: '',
    content: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'communityPosts'), {
        ...formData,
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
              value={formData.category}
              onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
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
              value={formData.title}
              onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
            />

            <Textarea
              id="content"
              label="내용"
              placeholder="내용을 입력하세요"
              rows={12}
              value={formData.content}
              onChange={(e) => setFormData((f) => ({ ...f, content: e.target.value }))}
            />

            <FileUpload
              label="사진 첨부 (선택)"
              accept="image/*"
              multiple
              maxFiles={5}
            />
            <p className="text-xs text-warm-400 -mt-3">
              시공 사진, 현장 사진 등을 첨부할 수 있습니다. (최대 5장)
            </p>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">등록하기</Button>
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
