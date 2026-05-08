import { NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard, User, Cpu, Briefcase, FolderOpen,
  GitBranch, Trophy, ImageIcon, MessageSquare, Settings,
  LogOut, ChevronLeft, ChevronRight, Zap, Sun, Moon, Palette
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Profile', icon: User, path: '/profile' },
  { label: 'Technologies', icon: Cpu, path: '/technologies' },
  { label: 'Services', icon: Briefcase, path: '/services' },
  { label: 'Projects', icon: FolderOpen, path: '/projects' },
  { label: 'Journey', icon: GitBranch, path: '/journey' },
  { label: 'Achievements', icon: Trophy, path: '/achievements' },
  { label: 'Media Library', icon: ImageIcon, path: '/media' },
  { label: 'Messages', icon: MessageSquare, path: '/messages' },
  { label: 'Interests', icon: Palette, path: '/interests' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export function Sidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, closeMobile } = useSidebar();
  const { resolvedTheme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isDark = resolvedTheme === 'dark';

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`flex items-center h-16 px-4 border-b border-sidebar-border flex-shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <span className="text-sidebar-foreground font-semibold tracking-tight">AdminPanel</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
        )}
        <button
          onClick={toggleCollapsed}
          className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={closeMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors group relative ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="text-sm">{item.label}</span>}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-border">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="flex-shrink-0 px-2 pb-4 space-y-1 border-t border-sidebar-border pt-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-3 px-3 py-2 rounded-md w-full text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          {isDark ? <Sun className="w-4 h-4 flex-shrink-0" /> : <Moon className="w-4 h-4 flex-shrink-0" />}
          {!collapsed && <span className="text-sm">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2 rounded-md w-full text-red-500 hover:bg-red-500/10 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>

        {/* User profile */}
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 mt-1 rounded-md bg-sidebar-accent/40">
            <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-sidebar-primary-foreground font-medium">{user.username.substring(0, 2).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-sidebar-foreground truncate font-medium">{user.username}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">Admin</p>
            </div>
          </div>
        )}
        {collapsed && user && (
          <div className="flex justify-center px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center">
              <span className="text-xs text-sidebar-primary-foreground font-medium">{user.username.substring(0, 2).toUpperCase()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 flex-shrink-0 ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={closeMobile} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-50">
            <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sidebar-primary flex items-center justify-center">
                  <Zap className="w-4 h-4 text-sidebar-primary-foreground" />
                </div>
                <span className="text-sidebar-foreground font-semibold tracking-tight">AdminPanel</span>
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/60'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="px-2 pb-4 space-y-1 border-t border-sidebar-border pt-3">
              <button onClick={toggleTheme} className="flex items-center gap-3 px-3 py-2 rounded-md w-full text-sidebar-foreground hover:bg-sidebar-accent/60 transition-colors">
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="text-sm">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-md w-full text-red-500 hover:bg-red-500/10 transition-colors">
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
              {user && (
                <div className="flex items-center gap-3 px-3 py-2 mt-1 rounded-md bg-sidebar-accent/40">
                  <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center">
                    <span className="text-xs text-sidebar-primary-foreground font-medium">{user.username.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-xs text-sidebar-foreground font-medium">{user.username}</p>
                    <p className="text-xs text-sidebar-foreground/60">Admin</p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
