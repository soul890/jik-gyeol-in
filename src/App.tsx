import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// 배포 후 청크 해시가 바뀌면 이전 청크 로드 실패 → 자동 새로고침
function lazyLoad<T extends Record<string, unknown>>(
  factory: () => Promise<T>,
  pick: (m: T) => React.ComponentType,
) {
  return lazy(() =>
    factory()
      .then((m) => ({ default: pick(m) }))
      .catch(() => {
        window.location.reload();
        return new Promise<never>(() => {}); // 새로고침 동안 대기
      }),
  );
}

const HomePage = lazyLoad(() => import('@/pages/Home/HomePage'), (m) => m.HomePage as React.ComponentType);
const JobBoardPage = lazyLoad(() => import('@/pages/Jobs/JobBoardPage'), (m) => m.JobBoardPage as React.ComponentType);
const JobDetailPage = lazyLoad(() => import('@/pages/Jobs/JobDetailPage'), (m) => m.JobDetailPage as React.ComponentType);
const JobPostForm = lazyLoad(() => import('@/pages/Jobs/JobPostForm'), (m) => m.JobPostForm as React.ComponentType);
const CompanyListPage = lazyLoad(() => import('@/pages/Companies/CompanyListPage'), (m) => m.CompanyListPage as React.ComponentType);
const CompanyDetailPage = lazyLoad(() => import('@/pages/Companies/CompanyDetailPage'), (m) => m.CompanyDetailPage as React.ComponentType);
const CompanyRegisterPage = lazyLoad(() => import('@/pages/Companies/CompanyRegisterPage'), (m) => m.CompanyRegisterPage as React.ComponentType);
const SupplierListPage = lazyLoad(() => import('@/pages/Suppliers/SupplierListPage'), (m) => m.SupplierListPage as React.ComponentType);
const SupplierDetailPage = lazyLoad(() => import('@/pages/Suppliers/SupplierDetailPage'), (m) => m.SupplierDetailPage as React.ComponentType);
const SupplierRegisterPage = lazyLoad(() => import('@/pages/Suppliers/SupplierRegisterPage'), (m) => m.SupplierRegisterPage as React.ComponentType);
const CommunityPage = lazyLoad(() => import('@/pages/Community/CommunityPage'), (m) => m.CommunityPage as React.ComponentType);
const PostDetailPage = lazyLoad(() => import('@/pages/Community/PostDetailPage'), (m) => m.PostDetailPage as React.ComponentType);
const PostWritePage = lazyLoad(() => import('@/pages/Community/PostWritePage'), (m) => m.PostWritePage as React.ComponentType);
const PricingPage = lazyLoad(() => import('@/pages/Pricing/PricingPage'), (m) => m.PricingPage as React.ComponentType);
const LoginPage = lazyLoad(() => import('@/pages/Auth/LoginPage'), (m) => m.LoginPage as React.ComponentType);
const SignupPage = lazyLoad(() => import('@/pages/Auth/SignupPage'), (m) => m.SignupPage as React.ComponentType);
const ExpertRegisterPage = lazyLoad(() => import('@/pages/Experts/ExpertRegisterPage'), (m) => m.ExpertRegisterPage as React.ComponentType);
const AIDesignPage = lazyLoad(() => import('@/pages/AIDesign/AIDesignPage'), (m) => m.AIDesignPage as React.ComponentType);
const CheckoutPage = lazyLoad(() => import('@/pages/Payment/CheckoutPage'), (m) => m.CheckoutPage as React.ComponentType);
const PaymentSuccessPage = lazyLoad(() => import('@/pages/Payment/PaymentSuccessPage'), (m) => m.PaymentSuccessPage as React.ComponentType);
const PaymentFailPage = lazyLoad(() => import('@/pages/Payment/PaymentFailPage'), (m) => m.PaymentFailPage as React.ComponentType);
const ChatListPage = lazyLoad(() => import('@/pages/Chat/ChatListPage'), (m) => m.ChatListPage as React.ComponentType);
const ChatRoomPage = lazyLoad(() => import('@/pages/Chat/ChatRoomPage'), (m) => m.ChatRoomPage as React.ComponentType);
const MyPage = lazyLoad(() => import('@/pages/MyPage/MyPage'), (m) => m.MyPage as React.ComponentType);
const SearchPage = lazyLoad(() => import('@/pages/Search/SearchPage'), (m) => m.SearchPage as React.ComponentType);
const AdminPage = lazyLoad(() => import('@/pages/Admin/AdminPage'), (m) => m.AdminPage as React.ComponentType);
const TermsPage = lazyLoad(() => import('@/pages/Legal/TermsPage'), (m) => m.TermsPage as React.ComponentType);
const PrivacyPage = lazyLoad(() => import('@/pages/Legal/PrivacyPage'), (m) => m.PrivacyPage as React.ComponentType);
const AboutPage = lazyLoad(() => import('@/pages/About/AboutPage'), (m) => m.AboutPage as React.ComponentType);
const ContactPage = lazyLoad(() => import('@/pages/Contact/ContactPage'), (m) => m.ContactPage as React.ComponentType);
const NotFoundPage = lazyLoad(() => import('@/pages/NotFound/NotFoundPage'), (m) => m.NotFoundPage as React.ComponentType);

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );
}

function Protected({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProtectedRoute>{children}</ProtectedRoute>
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // 공개 페이지
      { index: true, element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense> },
      { path: 'jobs', element: <Suspense fallback={<PageLoader />}><JobBoardPage /></Suspense> },
      { path: 'jobs/:id', element: <Suspense fallback={<PageLoader />}><JobDetailPage /></Suspense> },
      { path: 'companies', element: <Suspense fallback={<PageLoader />}><CompanyListPage /></Suspense> },
      { path: 'companies/:id', element: <Suspense fallback={<PageLoader />}><CompanyDetailPage /></Suspense> },
      { path: 'suppliers', element: <Suspense fallback={<PageLoader />}><SupplierListPage /></Suspense> },
      { path: 'suppliers/:id', element: <Suspense fallback={<PageLoader />}><SupplierDetailPage /></Suspense> },
      { path: 'community', element: <Suspense fallback={<PageLoader />}><CommunityPage /></Suspense> },
      { path: 'community/:id', element: <Suspense fallback={<PageLoader />}><PostDetailPage /></Suspense> },
      { path: 'search', element: <Suspense fallback={<PageLoader />}><SearchPage /></Suspense> },
      { path: 'pricing', element: <Suspense fallback={<PageLoader />}><PricingPage /></Suspense> },
      { path: 'login', element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
      { path: 'signup', element: <Suspense fallback={<PageLoader />}><SignupPage /></Suspense> },
      { path: 'terms', element: <Suspense fallback={<PageLoader />}><TermsPage /></Suspense> },
      { path: 'privacy', element: <Suspense fallback={<PageLoader />}><PrivacyPage /></Suspense> },
      { path: 'about', element: <Suspense fallback={<PageLoader />}><AboutPage /></Suspense> },
      { path: 'contact', element: <Suspense fallback={<PageLoader />}><ContactPage /></Suspense> },
      { path: 'payment/success', element: <Suspense fallback={<PageLoader />}><PaymentSuccessPage /></Suspense> },
      { path: 'payment/fail', element: <Suspense fallback={<PageLoader />}><PaymentFailPage /></Suspense> },
      { path: '*', element: <Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense> },

      // 로그인 필요한 페이지
      { path: 'jobs/new', element: <Protected><JobPostForm /></Protected> },
      { path: 'companies/register', element: <Protected><CompanyRegisterPage /></Protected> },
      { path: 'suppliers/register', element: <Protected><SupplierRegisterPage /></Protected> },
      { path: 'community/write', element: <Protected><PostWritePage /></Protected> },
      { path: 'experts/register', element: <Protected><ExpertRegisterPage /></Protected> },
      { path: 'ai-design', element: <Protected><AIDesignPage /></Protected> },
      { path: 'payment/checkout', element: <Protected><CheckoutPage /></Protected> },
      { path: 'chat', element: <Protected><ChatListPage /></Protected> },
      { path: 'chat/:roomId', element: <Protected><ChatRoomPage /></Protected> },
      { path: 'mypage', element: <Protected><MyPage /></Protected> },
      { path: 'admin', element: <Protected><AdminPage /></Protected> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
