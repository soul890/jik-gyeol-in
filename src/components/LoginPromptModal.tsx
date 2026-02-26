import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginPromptModal({ isOpen, onClose }: LoginPromptModalProps) {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleSignup = () => {
    onClose();
    navigate('/signup');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="로그인이 필요합니다">
      <div className="space-y-5">
        <p className="text-sm text-warm-600">
          이 기능을 사용하려면 로그인이 필요합니다. 로그인하거나 회원가입하여 시작하세요.
        </p>

        <div className="flex gap-3">
          <Button className="flex-1" onClick={handleLogin}>
            <LogIn className="w-4 h-4" />
            로그인
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleSignup}>
            회원가입
          </Button>
        </div>
      </div>
    </Modal>
  );
}
