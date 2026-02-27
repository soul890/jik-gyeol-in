import { useAuth } from '@/contexts/AuthContext';

/** 플랜별 AI 디자인 월 사용 한도 */
const AI_DESIGN_LIMITS = { free: 3, pro: 30, business: 50 } as const;

function isSameMonth(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

export function useSubscription() {
  const { user, profile } = useAuth();

  const isLoggedIn = !!user;
  const subscription = profile?.subscription;
  const usage = profile?.usage;

  const isActive =
    !!subscription?.endDate &&
    new Date(subscription.endDate) > new Date();

  const isPro = isActive && (subscription?.plan === 'pro' || subscription?.plan === 'business');
  const isBusiness = isActive && subscription?.plan === 'business';

  // 이번 달 사용량 계산 (월이 바뀌었으면 0으로 리셋)
  const aiDesignUsed = isSameMonth(usage?.lastResetDate) ? (usage?.aiDesignCount ?? 0) : 0;

  // 플랜별 한도
  const plan = isBusiness ? 'business' : isPro ? 'pro' : 'free';
  const aiDesignLimit = AI_DESIGN_LIMITS[plan];
  const canUseAIDesign = aiDesignUsed < aiDesignLimit;

  const maxPortfolioImages = isBusiness ? Infinity : isPro ? 20 : 3;

  return {
    isPro,
    isBusiness,
    canUseAIDesign,
    maxPortfolioImages,
    aiDesignUsed,
    aiDesignLimit,
    isLoggedIn,
  };
}
