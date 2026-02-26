import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { categories } from '@/data/categories';
import { Modal } from '@/components/ui/Modal';

export function JobPostForm() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const categoryOptions = [
    { value: '', label: '공정을 선택하세요' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
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
              options={[
                { value: '구인', label: '구인 (사람을 찾습니다)' },
                { value: '구직', label: '구직 (일을 찾습니다)' },
              ]}
            />

            <Select id="category" label="공정" options={categoryOptions} />

            <Input id="title" label="제목" placeholder="제목을 입력하세요" />

            <Input id="location" label="지역" placeholder="예: 서울 강남구" />

            <Input id="pay" label="급여/단가" placeholder="예: 일 35만원, 건당 200만원" />

            <Textarea
              id="description"
              label="상세 내용"
              placeholder="작업 내용, 기간, 자격 요건 등을 자세히 적어주세요"
              rows={8}
            />

            <FileUpload
              label="사진 첨부 (선택)"
              accept="image/*"
              multiple
              maxFiles={5}
            />
            <p className="text-xs text-warm-400 -mt-3">
              현장 사진, 시공 사례, 자격증 등을 첨부하면 신뢰도가 높아집니다. (최대 5장)
            </p>

            <Input id="contact" label="연락처" placeholder="전화번호 또는 이메일" />

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
        <p className="text-warm-600 mb-4">게시글이 등록되었습니다. (데모)</p>
        <Button onClick={() => { setShowSuccess(false); navigate('/jobs'); }} className="w-full">
          확인
        </Button>
      </Modal>
    </div>
  );
}
