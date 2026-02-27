import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { BlockEditor } from '@/components/community/BlockEditor';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { Block } from '@/types';

export function SupplierRegisterPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [products, setProducts] = useState('');
  const [location, setLocation] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [delivery, setDelivery] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [blocks, setBlocks] = useState<Block[]>([{ type: 'text', value: '' }]);
  const supplierId = useMemo(() => crypto.randomUUID(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const images = blocks
        .filter((b): b is Extract<Block, { type: 'image' }> => b.type === 'image' && !!b.url)
        .map((b) => b.url);
      const description = blocks
        .filter((b): b is Extract<Block, { type: 'text' }> => b.type === 'text')
        .map((b) => b.value)
        .join('\n');

      await addDoc(collection(db, 'suppliers'), {
        uid: user?.uid || '',
        name,
        description,
        blocks,
        categories: [],
        products: products.split(',').map((p) => p.trim()).filter(Boolean),
        location,
        minOrderAmount: minOrder,
        deliveryInfo: delivery,
        phone,
        contact: email,
        rating: 0,
        reviewCount: 0,
        images,
        commentCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      });

      setShowSuccess(true);
    } catch {
      setError('등록에 실패했습니다. Firebase 설정을 확인해주세요.');
    } finally {
      setSubmitting(false);
    }
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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <Input id="name" label="업체명" placeholder="업체명을 입력하세요" value={name} onChange={(e) => setName(e.target.value)} required />

            <div>
              <label className="block text-sm font-medium text-warm-700 mb-2">업체 소개</label>
              <div className="border border-warm-200 rounded-lg p-4 bg-white min-h-[200px]">
                <BlockEditor blocks={blocks} onChange={setBlocks} storagePath={`suppliers/${supplierId}/images`} />
              </div>
              <p className="text-xs text-warm-400 mt-2">
                블록 사이의 + 버튼으로 텍스트, 사진, 구분선을 추가할 수 있습니다.
              </p>
            </div>

            <Textarea id="products" label="취급 제품" placeholder="취급 제품을 쉼표로 구분하여 입력해주세요" rows={3} value={products} onChange={(e) => setProducts(e.target.value)} />

            <Input id="location" label="위치" placeholder="예: 경기 광주시" value={location} onChange={(e) => setLocation(e.target.value)} />
            <Input id="minOrder" label="최소 주문 금액" placeholder="예: 50만원" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />
            <Input id="delivery" label="배송 정보" placeholder="예: 수도권 당일 배송" value={delivery} onChange={(e) => setDelivery(e.target.value)} />
            <Input id="phone" label="전화번호" placeholder="02-XXXX-XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input id="email" label="이메일" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    등록 중...
                  </>
                ) : '등록하기'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/suppliers')} disabled={submitting}>
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Modal isOpen={showSuccess} onClose={() => { setShowSuccess(false); navigate('/suppliers'); }} title="등록 완료">
        <p className="text-warm-600 mb-4">자재업체가 등록되었습니다.</p>
        <Button onClick={() => { setShowSuccess(false); navigate('/suppliers'); }} className="w-full">
          확인
        </Button>
      </Modal>
    </div>
  );
}
