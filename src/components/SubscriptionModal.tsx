import { useNavigate } from 'react-router-dom';
import { Sparkles, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: 'ai-design' | 'portfolio';
}

const triggerMessages = {
  'ai-design': '이번 달 AI 디자인 사용 횟수를 모두 소진했습니다. 더 많은 횟수가 필요하시면 업그레이드해 주세요.',
  'portfolio': '무료 플랜은 포트폴리오 사진을 최대 3장까지 업로드할 수 있습니다.',
};

const proBenefits = [
  'AI 인테리어 디자인 월 30회 사용',
  '포트폴리오 사진 최대 20장',
  '검색 결과 상단 노출',
  '프로 인증 뱃지',
  '프로필 카드 강조 표시',
];

export function SubscriptionModal({ isOpen, onClose, trigger }: SubscriptionModalProps) {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    onClose();
    navigate('/payment/checkout?plan=pro');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pro 구독으로 업그레이드">
      <div className="space-y-5">
        <p className="text-sm text-warm-600">
          {triggerMessages[trigger]}
        </p>

        <div className="bg-primary-50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-warm-800">Pro 플랜</p>
              <p className="text-sm text-warm-500">월 19,900원</p>
            </div>
          </div>

          <ul className="space-y-2">
            {proBenefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                <span className="text-warm-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3">
          <Button className="flex-1" onClick={handleSubscribe}>
            <Sparkles className="w-4 h-4" />
            구독하기
          </Button>
          <Button variant="outline" onClick={onClose}>
            나중에
          </Button>
        </div>
      </div>
    </Modal>
  );
}
