import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { FileUpload } from '@/components/ui/FileUpload';
import { categories } from '@/data/categories';
import { cn } from '@/utils/cn';

const regions = [
  '서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종',
  '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
];

export function ExpertRegisterPage() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const toggleProcess = (id: string) => {
    setSelectedProcesses((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-warm-500 hover:text-warm-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        홈으로
      </Link>

      <h1 className="text-2xl font-bold text-warm-800 mb-6">전문가 등록</h1>

      <Card>
        <CardContent className="py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input id="name" label="이름" placeholder="이름을 입력하세요" required />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-warm-700">전문 공정 (복수 선택)</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleProcess(cat.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer',
                      selectedProcesses.includes(cat.id)
                        ? 'bg-primary-500 text-white'
                        : 'bg-warm-100 text-warm-600 hover:bg-warm-200',
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <Input id="experience" label="경력" placeholder="예: 10년" required />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-warm-700">활동 지역 (복수 선택)</label>
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => toggleRegion(region)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer',
                      selectedRegions.includes(region)
                        ? 'bg-primary-500 text-white'
                        : 'bg-warm-100 text-warm-600 hover:bg-warm-200',
                    )}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            <Textarea id="bio" label="자기소개" placeholder="경력과 강점을 소개해주세요" rows={4} />

            <Input id="phone" label="전화번호" placeholder="010-XXXX-XXXX" required />
            <Input id="email" label="이메일" type="email" placeholder="example@email.com" required />
            <Input id="rate" label="희망 단가" placeholder="예: 일당 30만원, 평당 5만원 등" />

            <FileUpload
              label="포트폴리오 사진 (최대 5장)"
              accept="image/*"
              multiple
              maxFiles={5}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">등록하기</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/')}>
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Modal isOpen={showSuccess} onClose={() => { setShowSuccess(false); navigate('/'); }} title="등록 완료">
        <p className="text-warm-600 mb-4">전문가 등록이 완료되었습니다. (데모)</p>
        <Button onClick={() => { setShowSuccess(false); navigate('/'); }} className="w-full">
          확인
        </Button>
      </Modal>
    </div>
  );
}
