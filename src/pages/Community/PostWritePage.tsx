import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { FileUpload } from '@/components/ui/FileUpload';

export function PostWritePage() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
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
              options={[
                { value: '시공노하우', label: '시공노하우' },
                { value: '질문답변', label: '질문답변' },
                { value: '자유게시판', label: '자유게시판' },
              ]}
            />

            <Input id="title" label="제목" placeholder="제목을 입력하세요" />

            <Textarea
              id="content"
              label="내용"
              placeholder="내용을 입력하세요"
              rows={12}
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
        <p className="text-warm-600 mb-4">게시글이 등록되었습니다. (데모)</p>
        <Button onClick={() => { setShowSuccess(false); navigate('/community'); }} className="w-full">
          확인
        </Button>
      </Modal>
    </div>
  );
}
