import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const HomePage = lazy(() => import('@/pages/Home/HomePage').then((m) => ({ default: m.HomePage })));
const JobBoardPage = lazy(() => import('@/pages/Jobs/JobBoardPage').then((m) => ({ default: m.JobBoardPage })));
const JobDetailPage = lazy(() => import('@/pages/Jobs/JobDetailPage').then((m) => ({ default: m.JobDetailPage })));
const JobPostForm = lazy(() => import('@/pages/Jobs/JobPostForm').then((m) => ({ default: m.JobPostForm })));
const CompanyListPage = lazy(() => import('@/pages/Companies/CompanyListPage').then((m) => ({ default: m.CompanyListPage })));
const CompanyDetailPage = lazy(() => import('@/pages/Companies/CompanyDetailPage').then((m) => ({ default: m.CompanyDetailPage })));
const CompanyRegisterPage = lazy(() => import('@/pages/Companies/CompanyRegisterPage').then((m) => ({ default: m.CompanyRegisterPage })));
const SupplierListPage = lazy(() => import('@/pages/Suppliers/SupplierListPage').then((m) => ({ default: m.SupplierListPage })));
const SupplierDetailPage = lazy(() => import('@/pages/Suppliers/SupplierDetailPage').then((m) => ({ default: m.SupplierDetailPage })));
const SupplierRegisterPage = lazy(() => import('@/pages/Suppliers/SupplierRegisterPage').then((m) => ({ default: m.SupplierRegisterPage })));
const CommunityPage = lazy(() => import('@/pages/Community/CommunityPage').then((m) => ({ default: m.CommunityPage })));
const PostDetailPage = lazy(() => import('@/pages/Community/PostDetailPage').then((m) => ({ default: m.PostDetailPage })));
const PostWritePage = lazy(() => import('@/pages/Community/PostWritePage').then((m) => ({ default: m.PostWritePage })));
const PricingPage = lazy(() => import('@/pages/Pricing/PricingPage').then((m) => ({ default: m.PricingPage })));
const LoginPage = lazy(() => import('@/pages/Auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('@/pages/Auth/SignupPage').then((m) => ({ default: m.SignupPage })));
const ExpertRegisterPage = lazy(() => import('@/pages/Experts/ExpertRegisterPage').then((m) => ({ default: m.ExpertRegisterPage })));
const AIDesignPage = lazy(() => import('@/pages/AIDesign/AIDesignPage').then((m) => ({ default: m.AIDesignPage })));
const CheckoutPage = lazy(() => import('@/pages/Payment/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const PaymentSuccessPage = lazy(() => import('@/pages/Payment/PaymentSuccessPage').then((m) => ({ default: m.PaymentSuccessPage })));
const PaymentFailPage = lazy(() => import('@/pages/Payment/PaymentFailPage').then((m) => ({ default: m.PaymentFailPage })));
const ChatListPage = lazy(() => import('@/pages/Chat/ChatListPage').then((m) => ({ default: m.ChatListPage })));
const ChatRoomPage = lazy(() => import('@/pages/Chat/ChatRoomPage').then((m) => ({ default: m.ChatRoomPage })));
const MyPage = lazy(() => import('@/pages/MyPage/MyPage').then((m) => ({ default: m.MyPage })));
const SearchPage = lazy(() => import('@/pages/Search/SearchPage').then((m) => ({ default: m.SearchPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
