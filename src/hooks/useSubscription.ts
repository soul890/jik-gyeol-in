import { useAuth } from '@/contexts/AuthContext';

export function useSubscription() {
  const { user, profile } = useAuth();

  const isLoggedIn = !!user;
  const subscription = profile?.subscription;
  const usage = profile?.usage;

  const isPro =
    subscription?.plan === 'pro' &&
    !!subscription.endDate &&
    new Date(subscription.endDate) > new Date();

  const aiDesignUsed = usage?.aiDesignCount ?? 0;
  const canUseAIDesign = isPro || aiDesignUsed < 1;
  const maxPortfolioImages = isPro ? 20 : 3;

  return {
    isPro,
    canUseAIDesign,
    maxPortfolioImages,
    aiDesignUsed,
    isLoggedIn,
  };
}
