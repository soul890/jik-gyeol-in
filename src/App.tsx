import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

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

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense> },
      { path: 'jobs', element: <Suspense fallback={<PageLoader />}><JobBoardPage /></Suspense> },
      { path: 'jobs/new', element: <Suspense fallback={<PageLoader />}><JobPostForm /></Suspense> },
      { path: 'jobs/:id', element: <Suspense fallback={<PageLoader />}><JobDetailPage /></Suspense> },
      { path: 'companies', element: <Suspense fallback={<PageLoader />}><CompanyListPage /></Suspense> },
      { path: 'companies/register', element: <Suspense fallback={<PageLoader />}><CompanyRegisterPage /></Suspense> },
      { path: 'companies/:id', element: <Suspense fallback={<PageLoader />}><CompanyDetailPage /></Suspense> },
      { path: 'suppliers', element: <Suspense fallback={<PageLoader />}><SupplierListPage /></Suspense> },
      { path: 'suppliers/register', element: <Suspense fallback={<PageLoader />}><SupplierRegisterPage /></Suspense> },
      { path: 'suppliers/:id', element: <Suspense fallback={<PageLoader />}><SupplierDetailPage /></Suspense> },
      { path: 'community', element: <Suspense fallback={<PageLoader />}><CommunityPage /></Suspense> },
      { path: 'community/write', element: <Suspense fallback={<PageLoader />}><PostWritePage /></Suspense> },
      { path: 'community/:id', element: <Suspense fallback={<PageLoader />}><PostDetailPage /></Suspense> },
      { path: 'pricing', element: <Suspense fallback={<PageLoader />}><PricingPage /></Suspense> },
      { path: 'login', element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
      { path: 'signup', element: <Suspense fallback={<PageLoader />}><SignupPage /></Suspense> },
      { path: 'experts/register', element: <Suspense fallback={<PageLoader />}><ExpertRegisterPage /></Suspense> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
