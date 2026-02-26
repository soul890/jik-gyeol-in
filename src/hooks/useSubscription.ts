import { useAuth } from '@/contexts/AuthContext';

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

  const aiDesignUsed = usage?.aiDesignCount ?? 0;
  const canUseAIDesign = isPro || aiDesignUsed < 1;
  const maxPortfolioImages = isBusiness ? Infinity : isPro ? 20 : 3;

  return {
    isPro,
    isBusiness,
    canUseAIDesign,
    maxPortfolioImages,
    aiDesignUsed,
    isLoggedIn,
  };
}
