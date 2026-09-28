import { useNotifications } from '@/hooks/useNotifications';
import { Check } from 'lucide-react';
import { formatDateTime } from '@/utils/formatDate';

export function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-navy">Notifications</h2>
        <div className="flex gap-2">
          <button onClick={markAllAsRead} className="btn-secondary text-sm">Mark all read</button>
          <button onClick={clearAll} className="btn-secondary text-sm">Clear all</button>
        </div>
      </div>
      <div className="space-y-3">
        {notifications.length === 0 && <p className="text-gray-500">No notifications</p>}
        {notifications.map((n) => (
          <div key={n.id} className={`card flex justify-between items-start ${!n.read ? 'border-l-4 border-primary-500' : ''}`}>
            <div>
              <h4 className="font-semibold">{n.title}</h4>
              <p className="text-sm text-gray-600">{n.message}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDateTime(n.date)}</p>
            </div>
            <div className="flex gap-2">
              {!n.read && <button onClick={() => markAsRead(n.id)} className="text-primary-500 hover:text-primary-700"><Check className="w-4 h-4" /></button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}