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

export function SupplierRegisterPage() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/suppliers" className="inline-flex items-center gap-1 text-sm text-warm-500 hover:text-warm-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        목록으로
      </Link>

      <h1 className="text-2xl font-bold text-warm-800 mb-6">자재업체 등록</h1>

      <Card>
        <CardContent className="py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input id="name" label="업체명" placeholder="업체명을 입력하세요" />

            <Textarea id="desc" label="업체 소개" placeholder="업체를 소개해주세요" rows={4} />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-warm-700">관련 공정 (복수 선택)</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer',
                      selectedCats.includes(cat.id)
                        ? 'bg-primary-500 text-white'
                        : 'bg-warm-100 text-warm-600 hover:bg-warm-200',
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <Textarea id="products" label="취급 제품" placeholder="취급 제품을 쉼표로 구분하여 입력해주세요" rows={3} />

            <Input id="location" label="위치" placeholder="예: 경기 광주시" />
            <Input id="minOrder" label="최소 주문 금액" placeholder="예: 50만원" />
            <Input id="delivery" label="배송 정보" placeholder="예: 수도권 당일 배송" />
            <Input id="phone" label="전화번호" placeholder="02-XXXX-XXXX" />
            <Input id="email" label="이메일" placeholder="example@email.com" />

            <FileUpload
              label="제품/매장 사진 (선택, 최대 5장)"
              accept="image/*"
              multiple
              maxFiles={5}
            />
            <p className="text-xs text-warm-400 -mt-3">
              대표 제품이나 매장 사진을 등록하면 노출도가 높아집니다.
            </p>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">등록하기</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/suppliers')}>
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Modal isOpen={showSuccess} onClose={() => { setShowSuccess(false); navigate('/suppliers'); }} title="등록 완료">
        <p className="text-warm-600 mb-4">자재업체가 등록되었습니다. (데모)</p>
        <Button onClick={() => { setShowSuccess(false); navigate('/suppliers'); }} className="w-full">
          확인
        </Button>
      </Modal>
    </div>
  );
}
