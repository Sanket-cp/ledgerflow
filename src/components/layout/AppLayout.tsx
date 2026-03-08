import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, BarChart3, Bell, Settings, Menu, X, ShoppingCart, Package, Download, Moon, Sun, MoreHorizontal, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import GlobalSearch from '@/components/GlobalSearch';

const navKeys = [
  { to: '/', icon: LayoutDashboard, key: 'dashboard' },
  { to: '/customers', icon: Users, key: 'customers' },
  { to: '/ledger', icon: BookOpen, key: 'ledger' },
  { to: '/sales', icon: ShoppingCart, key: 'sales' },
  { to: '/inventory', icon: Package, key: 'inventory' },
  { to: '/reports', icon: BarChart3, key: 'reports' },
  { to: '/reminders', icon: Bell, key: 'reminders' },
  { to: '/settings', icon: Settings, key: 'settings' },
];

// Bottom nav shows first 4 + "More" on mobile
const bottomNavItems = navKeys.slice(0, 4);
const moreItems = navKeys.slice(4);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay for sidebar (kept for "More" sheet) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Desktop sidebar - hidden on mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
              <BookOpen className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-sidebar-primary-foreground">LedgerFlow</h1>
              <p className="text-xs text-sidebar-muted">{t('financialTracker')}</p>
            </div>
            <button className="ml-auto lg:hidden text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4 overflow-auto">
            {navKeys.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-primary'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-sidebar-border p-3 space-y-2">
            <button
              onClick={toggleTheme}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
            <NavLink
              to="/install"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-primary/80 hover:text-sidebar-primary-foreground'
                }`
              }
            >
              <Download className="h-4 w-4 shrink-0" />
              {t('install')}
            </NavLink>
            <div className="flex items-center gap-3 px-3 pt-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-medium text-sidebar-accent-foreground">{user?.name || 'User'}</p>
                <p className="text-xs text-sidebar-muted">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto pb-16 lg:pb-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 backdrop-blur-sm px-4 py-3">
          <h1 className="font-display text-lg font-bold lg:hidden">LedgerFlow</h1>
          <div className="flex-1" />
          <GlobalSearch />
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
        </div>
        <div className="p-4 lg:p-8">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border lg:hidden">
        <div className="flex items-stretch justify-around">
          {bottomNavItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`flex items-center justify-center w-10 h-7 rounded-full transition-colors ${isActive ? 'bg-primary/10' : ''}`}>
                    <item.icon className="h-4.5 w-4.5" />
                  </div>
                  <span>{t(item.key)}</span>
                </>
              )}
            </NavLink>
          ))}
          {/* More button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${moreOpen ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <div className={`flex items-center justify-center w-10 h-7 rounded-full transition-colors ${moreOpen ? 'bg-primary/10' : ''}`}>
              <MoreHorizontal className="h-4.5 w-4.5" />
            </div>
            <span>More</span>
          </button>
        </div>

        {/* More menu popup */}
        {moreOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
            <div className="absolute bottom-full left-0 right-0 z-50 bg-background border-t border-border rounded-t-2xl shadow-lg p-3 animate-in slide-in-from-bottom-2 duration-200">
              <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-3" />
              <div className="grid grid-cols-4 gap-2">
                {moreItems.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMoreOpen(false)}
                    className={({ isActive }) =>
                      `flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-colors ${
                        isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{t(item.key)}</span>
                  </NavLink>
                ))}
                <NavLink
                  to="/install"
                  onClick={() => setMoreOpen(false)}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-colors ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
                    }`
                  }
                >
                  <Download className="h-5 w-5" />
                  <span>{t('install')}</span>
                </NavLink>
                <button
                  onClick={() => { toggleTheme(); setMoreOpen(false); }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
                </button>
                <button
                  onClick={() => { handleLogout(); setMoreOpen(false); }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </>
        )}
      </nav>
    </div>
  );
}
