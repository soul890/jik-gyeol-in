import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, MapPin, Package, Truck, Banknote, MessageCircle, Send, X } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { suppliers } from '@/data/suppliers';
import { categories } from '@/data/categories';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Rating } from '@/components/ui/Rating';
import { Modal } from '@/components/ui/Modal';
import { db } from '@/lib/firebase';

export function SupplierDetailPage() {
  const { id } = useParams();
  const supplier = suppliers.find((s) => s.id === id);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        supplierId: supplier.id,
        supplierName: supplier.name,
        name: inquiryForm.name,
        phone: inquiryForm.phone,
        message: inquiryForm.message,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowInquiryModal(false);
    setInquiryForm({ name: '', phone: '', message: '' });
    setSubmitted(false);
  };

  if (!supplier) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-warm-700 mb-4">업체를 찾을 수 없습니다</h2>
        <Link to="/suppliers">
          <Button variant="outline">목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/suppliers" className="inline-flex items-center gap-1 text-sm text-warm-500 hover:text-warm-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        목록으로
      </Link>

      <Card>
        <CardContent className="py-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
              <Package className="w-8 h-8 text-accent" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-warm-800 mb-1">{supplier.name}</h1>
              <Rating value={supplier.rating} size="md" />
              <p className="text-sm text-warm-400 mt-1">리뷰 {supplier.reviewCount}개</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {supplier.categories.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              return cat ? <Badge key={catId} variant="primary">{cat.name}</Badge> : null;
            })}
          </div>

          <p className="text-warm-700 leading-relaxed mb-6">{supplier.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-warm-50 rounded-xl">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-warm-400" />
              <div>
                <p className="text-xs text-warm-400">위치</p>
                <p className="text-sm font-medium text-warm-700">{supplier.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Banknote className="w-4 h-4 text-warm-400" />
              <div>
                <p className="text-xs text-warm-400">최소 주문</p>
                <p className="text-sm font-medium text-warm-700">{supplier.minOrderAmount}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-warm-400" />
              <div>
                <p className="text-xs text-warm-400">배송</p>
                <p className="text-sm font-medium text-warm-700">{supplier.deliveryInfo}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-warm-800 mb-3">취급 제품</h3>
            <div className="flex flex-wrap gap-2">
              {supplier.products.map((product) => (
                <Badge key={product} variant="default">{product}</Badge>
              ))}
            </div>
          </div>

          {supplier.images && supplier.images.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-warm-800 mb-3">제품/매장 사진</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {supplier.images.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxUrl(url)}
                    className="aspect-[4/3] rounded-lg overflow-hidden border border-warm-200 cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={url}
                      alt={`제품 사진 ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-warm-200">
            <button
              onClick={() => setShowInquiryModal(true)}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              채팅으로 상담하기
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 이미지 라이트박스 */}
      {lightboxUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setLightboxUrl(null)}>
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxUrl}
            alt="제품 사진"
            className="max-w-full max-h-[85vh] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* 채팅 상담 모달 */}
      <Modal isOpen={showInquiryModal} onClose={handleCloseModal} title={`${supplier.name} 상담 문의`}>
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-warm-800 mb-2">상담 신청이 완료되었습니다</h4>
            <p className="text-sm text-warm-500 mb-6">업체에서 빠른 시일 내에 연락드리겠습니다.</p>
            <Button onClick={handleCloseModal} className="w-full">확인</Button>
          </div>
        ) : (
          <form onSubmit={handleInquirySubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">이름</label>
              <input
                type="text"
                required
                value={inquiryForm.name}
                onChange={(e) => setInquiryForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="홍길동"
                className="w-full px-3 py-2.5 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">연락처</label>
              <input
                type="tel"
                required
                value={inquiryForm.phone}
                onChange={(e) => setInquiryForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="010-0000-0000"
                className="w-full px-3 py-2.5 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">문의 내용</label>
              <textarea
                required
                rows={4}
                value={inquiryForm.message}
                onChange={(e) => setInquiryForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="상담 받고 싶은 내용을 자유롭게 작성해주세요."
                className="w-full px-3 py-2.5 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              {submitting ? '전송 중...' : '상담 신청하기'}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
