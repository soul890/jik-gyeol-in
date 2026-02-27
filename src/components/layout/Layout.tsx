import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { EmailVerificationBanner } from '@/components/EmailVerificationBanner';
import { CookieConsent } from '@/components/CookieConsent';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export function Layout() {
  useScrollToTop();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <EmailVerificationBanner />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
