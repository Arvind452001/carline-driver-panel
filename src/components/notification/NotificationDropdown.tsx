import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Zap,
  MapPin,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDateTime } from '@/utils/formatDate';
import type { Notification } from '@/types/notification';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'RIDE_REQUEST':
        return <Zap className="w-4 h-4 text-orange-500" />;
      case 'RIDE_CANCELLED':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'DRIVER_ARRIVED':
      case 'TRIP_STARTED':
      case 'DESTINATION_REACHED':
        return <MapPin className="w-4 h-4 text-emerald-500" />;
      case 'TRIP_COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'CHAT_MESSAGE':
        return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      case 'TEST_PUSH':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-[#FF5B26]" />;
    }
  };

  const handleItemClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    onClose();

    // Smart navigation based on payload type
    switch (notification.type) {
      case 'RIDE_REQUEST':
      case 'RIDE_CANCELLED':
      case 'DRIVER_ARRIVED':
      case 'TRIP_STARTED':
      case 'DESTINATION_REACHED':
      case 'CHAT_MESSAGE':
        navigate('/dashboard');
        break;
      case 'TRIP_COMPLETED':
      case 'PAYMENT_RECEIVED':
        navigate('/earnings');
        break;
      default:
        navigate('/notifications');
        break;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn"
    >
      {/* Header */}
      <div className="p-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-[#FF5B26] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="text-xs text-[#FF5B26] hover:text-[#e04e1e] font-semibold flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-100 px-4 pt-2 gap-4 text-xs font-semibold">
        <button
          onClick={() => setFilter('all')}
          className={`pb-2 border-b-2 transition-colors ${
            filter === 'all'
              ? 'border-[#FF5B26] text-[#FF5B26]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`pb-2 border-b-2 transition-colors ${
            filter === 'unread'
              ? 'border-[#FF5B26] text-[#FF5B26]'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-gray-400">
            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300 stroke-[1.5]" />
            <p className="text-xs font-medium">No notifications right now</p>
          </div>
        ) : (
          filtered.slice(0, 10).map((n) => (
            <div
              key={n._id}
              onClick={() => handleItemClick(n)}
              className={`p-3.5 hover:bg-gray-50/80 cursor-pointer transition-colors flex items-start gap-3 relative ${
                !n.isRead ? 'bg-orange-50/20' : ''
              }`}
            >
              {/* Type Icon */}
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                {getNotificationIcon(n.type)}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center justify-between gap-1">
                  <h4
                    className={`text-xs truncate ${
                      !n.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'
                    }`}
                  >
                    {n.title}
                  </h4>
                </div>
                <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                  {n.body || n.message}
                </p>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  {formatDateTime(n.createdAt)}
                </span>
              </div>

              {/* Unread dot */}
              {!n.isRead && (
                <span className="w-2 h-2 rounded-full bg-[#FF5B26] shrink-0 self-center" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
        <Link
          to="/notifications"
          onClick={onClose}
          className="text-xs font-bold text-[#FF5B26] hover:text-[#e04e1e] flex items-center gap-1 transition-colors w-full justify-center py-1"
        >
          <span>Open Notification Center</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
