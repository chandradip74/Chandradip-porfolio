import { useState } from 'react';
import { useLocation } from 'react-router';
import { Menu, Search, Bell, Sun, Moon, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const breadcrumbMap: Record<string, string> = {
  '/': 'Dashboard',
  '/profile': 'Profile',
  '/technologies': 'Technologies',
  '/services': 'Services',
  '/projects': 'Projects',
  '/journey': 'Journey',
  '/achievements': 'Achievements',
  '/media': 'Media Library',
  '/messages': 'Messages',
  '/settings': 'Settings',
};

export function Navbar() {
  const { toggleMobile } = useSidebar();
  const { resolvedTheme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const isDark = resolvedTheme === 'dark';
  const currentPage = breadcrumbMap[location.pathname] || 'Dashboard';

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setUserMenuOpen(false);
  };

  const notifications = [
    { id: 1, text: 'New message from John Doe', time: '2m ago', unread: true },
    { id: 2, text: 'Project "Portfolio v2" updated', time: '1h ago', unread: true },
    { id: 3, text: 'Certificate upload complete', time: '3h ago', unread: false },
  ];

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-30 flex items-center px-4 gap-4">
      {/* Mobile hamburger */}
      <button
        onClick={toggleMobile}
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-accent transition-colors"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground hidden sm:block">Admin</span>
        <span className="text-muted-foreground hidden sm:block">/</span>
        <span className="text-foreground font-medium">{currentPage}</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden md:flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9 pr-4 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent w-56 transition-all focus:w-72 text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-accent transition-colors"
      >
        {isDark ? <Sun className="w-4 h-4 text-foreground" /> : <Moon className="w-4 h-4 text-foreground" />}
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
          className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-accent transition-colors relative"
        >
          <Bell className="w-4 h-4 text-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {notifOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-sm font-medium text-foreground">Notifications</h3>
              </div>
              {notifications.map((n) => (
                <div key={n.id} className={`px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer ${n.unread ? 'border-l-2 border-blue-500' : ''}`}>
                  <p className="text-sm text-foreground">{n.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                </div>
              ))}
              <div className="px-4 py-2 border-t border-border">
                <button className="text-xs text-blue-500 hover:text-blue-600 transition-colors">Mark all as read</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs text-primary-foreground font-medium">{user?.initials}</span>
          </div>
          <span className="text-sm text-foreground hidden sm:block">{user?.name}</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
        </button>

        {userMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden py-1">
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <button
                onClick={() => { navigate('/profile'); setUserMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent w-full text-left transition-colors"
              >
                <User className="w-4 h-4" /> Profile
              </button>
              <button
                onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent w-full text-left transition-colors"
              >
                <Settings className="w-4 h-4" /> Settings
              </button>
              <div className="border-t border-border mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 w-full text-left transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
