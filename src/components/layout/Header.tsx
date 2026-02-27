import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Sparkles, MessageCircle, Search, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useNotifications } from '@/hooks/useNotifications';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/format';

const navItems = [
  { path: '/', label: '홈' },
  { path: '/jobs', label: '구인구직' },
  { path: '/companies', label: '인테리어 업체' },
  { path: '/suppliers', label: '자재업체' },
  { path: '/community', label: '커뮤니티' },
  { path: '/ai-design', label: 'AI 디자인', highlight: true },
  { path: '/pricing', label: '요금제' },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, profile, loading, logout } = useAuth();
  const { isPro } = useSubscription();
  const { notifications, unreadCount } = useNotifications();

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchQuery('');
    setSearchOpen(false);
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
                    item.highlight
                      ? isActive
                        ? 'bg-accent text-white'
                        : 'text-accent font-semibold hover:bg-accent/10'
                      : isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-warm-600 hover:text-warm-800 hover:bg-warm-100',
                  )}
                >
                  {item.highlight && <Sparkles className="w-3.5 h-3.5 inline mr-1" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {/* 검색 */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="검색어를 입력하세요"
                  autoFocus
                  className="w-48 px-3 py-1.5 text-sm border border-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                  onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                />
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-warm-500 hover:text-warm-700 hover:bg-warm-100 transition-colors cursor-pointer"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
            )}

            {loading ? null : user ? (
              <>
                <Link to="/mypage" className="flex items-center gap-1 text-sm text-warm-600 hover:text-warm-800 transition-colors">
                  <User className="w-4 h-4" />
                  {profile?.nickname || user.email}
                  {isPro && (
                    <span className="ml-1 px-1.5 py-0.5 bg-primary-500 text-white text-xs font-bold rounded">
                      Pro
                    </span>
                  )}
                </Link>
                {/* 알림 */}
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative p-2 rounded-lg text-warm-500 hover:text-warm-700 hover:bg-warm-100 transition-colors cursor-pointer"
                  >
                    <Bell className="w-4.5 h-4.5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-warm-200 z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-warm-100 flex items-center justify-between">
                          <h3 className="font-semibold text-warm-800 text-sm">알림</h3>
                          {notifications.length > 0 && (
                            <Link
                              to="/chat"
                              onClick={() => setNotifOpen(false)}
                              className="text-xs text-primary-500 hover:text-primary-600"
                            >
                              모두 보기
                            </Link>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-warm-400">
                              새로운 알림이 없습니다
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <Link
                                key={n.id}
                                to={n.link}
                                onClick={() => setNotifOpen(false)}
                                className="block px-4 py-3 hover:bg-warm-50 border-b border-warm-50 transition-colors"
                              >
                                <div className="flex items-start gap-2">
                                  <MessageCircle className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-warm-800">{n.title}</p>
                                    <p className="text-xs text-warm-500 truncate">{n.message}</p>
                                    {n.createdAt && (
                                      <p className="text-xs text-warm-400 mt-0.5">{formatDate(n.createdAt)}</p>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <Link
                  to="/chat"
                  className="relative flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-warm-600 hover:text-warm-800 hover:bg-warm-100 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  채팅
                </Link>
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
            {/* 모바일 검색 */}
            <form onSubmit={handleSearch} className="mb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="통합 검색"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 bg-warm-50"
                />
              </div>
            </form>

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
                    item.highlight
                      ? isActive
                        ? 'bg-accent text-white'
                        : 'text-accent font-semibold hover:bg-accent/10'
                      : isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-warm-600 hover:bg-warm-100',
                  )}
                >
                  {item.highlight && <Sparkles className="w-3.5 h-3.5 inline mr-1" />}
                  {item.label}
                </Link>
              );
            })}

            <div className="border-t border-warm-200 mt-2 pt-2">
              {loading ? null : user ? (
                <>
                  <Link
                    to="/mypage"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-1 px-3 py-2.5 text-sm text-warm-600 hover:bg-warm-100 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    {profile?.nickname || user.email}
                    {isPro && (
                      <span className="ml-1 px-1.5 py-0.5 bg-primary-500 text-white text-xs font-bold rounded">
                        Pro
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/chat"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-1 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-warm-600 hover:bg-warm-100 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    채팅
                    {unreadCount > 0 && (
                      <span className="ml-auto px-2 py-0.5 bg-accent text-white text-[10px] font-bold rounded-full">
                        {unreadCount > 9 ? '9+' : `${unreadCount}개 새 메시지`}
                      </span>
                    )}
                  </Link>
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
