import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { SidebarProvider } from '../context/SidebarContext';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function Layout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
