import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

const navItems = [
  { path: '/', label: '홈' },
  { path: '/jobs', label: '구인구직' },
  { path: '/companies', label: '인테리어 업체' },
  { path: '/suppliers', label: '자재업체' },
  { path: '/community', label: '커뮤니티' },
  { path: '/pricing', label: '요금제' },
];

export function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">人</span>
            </div>
            <span className="text-xl font-bold text-warm-800">
              직결<span className="text-accent">-</span>인
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-warm-600 hover:text-warm-800 hover:bg-warm-100',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {loading ? null : user ? (
              <>
                <span className="flex items-center gap-1 text-sm text-warm-600">
                  <User className="w-4 h-4" />
                  {profile?.nickname || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-warm-600 hover:text-warm-800 hover:bg-warm-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-warm-600 hover:text-warm-800 hover:bg-warm-100 transition-colors"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-warm-100 cursor-pointer"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-warm-200 bg-white">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-warm-600 hover:bg-warm-100',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="border-t border-warm-200 mt-2 pt-2">
              {loading ? null : user ? (
                <>
                  <div className="flex items-center gap-1 px-3 py-2.5 text-sm text-warm-600">
                    <User className="w-4 h-4" />
                    {profile?.nickname || user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-warm-600 hover:bg-warm-100 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-warm-600 hover:bg-warm-100 transition-colors"
                  >
                    로그인
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
