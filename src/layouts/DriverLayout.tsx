import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { DriverSidebar } from '@/components/layout/DriverSidebar';
import { DriverBottomNav } from '@/components/layout/DriverBottomNav';
import { DriverHeader } from '@/components/layout/DriverHeader';
import { NotificationToast } from '@/components/notification/NotificationToast';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

export function DriverLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();
  const { unreadCount, activeToast, dismissToast, markAsRead } = useNotifications();
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => setSidebarOpen(false), [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50/70 flex w-full max-w-full overflow-x-hidden">
      {/* Real-time In-App Notification Toast */}
      <NotificationToast
        notification={activeToast}
        onDismiss={dismissToast}
        onMarkRead={markAsRead}
      />

      {/* Permanent desktop sidebar & mobile drawer */}
      <DriverSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Column with strict overflow-x-hidden & min-w-0 */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 w-full min-w-0 max-w-full overflow-x-hidden">
        <DriverHeader
          onMenuClick={() => setSidebarOpen(true)}
          userName={user?.name || 'Driver'}
          userAvatar={user?.avatar}
          notificationCount={unreadCount}
        />

        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 w-full min-w-0 max-w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full min-w-0">
            <Outlet />
          </div>
        </main>

        {isMobile && <DriverBottomNav />}
      </div>
    </div>
  );
}