import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Zap,
  MapPin,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  X,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import type { Notification } from '@/types/notification';

interface NotificationToastProps {
  notification: Notification | null;
  onDismiss: () => void;
  onMarkRead?: (id: string) => void;
}

export function NotificationToast({
  notification,
  onDismiss,
  onMarkRead,
}: NotificationToastProps) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const durationMs = 6000;
  const startTimeRef = useRef<number>(Date.now());
  const elapsedRef = useRef<number>(0);

  useEffect(() => {
    if (!notification) {
      setProgress(100);
      elapsedRef.current = 0;
      return;
    }

    startTimeRef.current = Date.now();
    elapsedRef.current = 0;
    setProgress(100);

    const interval = setInterval(() => {
      if (isHovered) {
        startTimeRef.current = Date.now() - elapsedRef.current;
        return;
      }

      const elapsed = Date.now() - startTimeRef.current;
      elapsedRef.current = elapsed;
      const remainingPct = Math.max(0, 100 - (elapsed / durationMs) * 100);
      setProgress(remainingPct);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        onDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [notification, isHovered, onDismiss]);

  if (!notification) return null;

  const getTypeConfig = () => {
    switch (notification.type) {
      case 'RIDE_REQUEST':
        return {
          icon: Zap,
          bg: 'bg-orange-500',
          textColor: 'text-orange-500',
          borderColor: 'border-orange-500',
          badgeText: 'New Ride Request',
          actionText: 'View Request',
          actionUrl: '/dashboard',
        };
      case 'RIDE_CANCELLED':
        return {
          icon: AlertTriangle,
          bg: 'bg-rose-500',
          textColor: 'text-rose-500',
          borderColor: 'border-rose-400',
          badgeText: 'Trip Cancelled',
          actionText: 'Return to Radar',
          actionUrl: '/dashboard',
        };
      case 'DRIVER_ARRIVED':
      case 'DESTINATION_REACHED':
      case 'TRIP_STARTED':
        return {
          icon: MapPin,
          bg: 'bg-emerald-500',
          textColor: 'text-emerald-500',
          borderColor: 'border-emerald-400',
          badgeText: 'Ride Status',
          actionText: 'Open Trip',
          actionUrl: '/dashboard',
        };
      case 'TRIP_COMPLETED':
        return {
          icon: CheckCircle2,
          bg: 'bg-green-600',
          textColor: 'text-green-600',
          borderColor: 'border-green-400',
          badgeText: 'Trip Completed',
          actionText: 'View Earnings',
          actionUrl: '/earnings',
        };
      case 'CHAT_MESSAGE':
        return {
          icon: MessageSquare,
          bg: 'bg-indigo-500',
          textColor: 'text-indigo-500',
          borderColor: 'border-indigo-400',
          badgeText: 'Passenger Message',
          actionText: 'Reply in Chat',
          actionUrl: '/dashboard',
        };
      case 'TEST_PUSH':
        return {
          icon: Sparkles,
          bg: 'bg-purple-500',
          textColor: 'text-purple-500',
          borderColor: 'border-purple-400',
          badgeText: 'Test Notification',
          actionText: 'View Center',
          actionUrl: '/notifications',
        };
      default:
        return {
          icon: Bell,
          bg: 'bg-[#FF5B26]',
          textColor: 'text-[#FF5B26]',
          borderColor: 'border-orange-400',
          badgeText: 'Update',
          actionText: 'View Details',
          actionUrl: '/notifications',
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;
  const rideId = notification.data?.rideId;
  const otp = notification.data?.otp;

  const handleActionClick = () => {
    if (onMarkRead && notification._id) {
      onMarkRead(notification._id);
    }
    onDismiss();
    const destination = rideId ? `/dashboard?rideId=${rideId}` : config.actionUrl;
    navigate(destination);
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed top-4 right-4 z-50 w-[92vw] max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100/80 overflow-hidden transition-all duration-300 animate-slideInRight"
    >
      {/* Accent Header Bar */}
      <div className={`h-1.5 w-full ${config.bg}`} />

      <div className="p-4 sm:p-4.5">
        <div className="flex items-start gap-3.5">
          {/* Pulsing Icon Bubble */}
          <div
            className={`w-11 h-11 rounded-xl ${config.bg} text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/10 relative`}
          >
            <Icon className="w-5 h-5" />
            {notification.type === 'RIDE_REQUEST' && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-600"></span>
              </span>
            )}
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {config.badgeText}
              </span>
              <button
                onClick={onDismiss}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h4 className="font-bold text-gray-900 text-sm mt-1 leading-snug truncate">
              {notification.title}
            </h4>
            <p className="text-xs text-gray-600 mt-0.5 line-clamp-2 leading-relaxed">
              {notification.body || notification.message}
            </p>

            {/* OTP badge if present */}
            {otp && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                OTP: {otp}
              </div>
            )}

            {/* Actions */}
            <div className="mt-3 flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={handleActionClick}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5B26] hover:text-[#e04e1e] transition-colors"
              >
                <span>{config.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onDismiss}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-dismiss progress bar */}
      <div className="w-full bg-gray-100 h-1">
        <div
          className={`h-full ${config.bg} transition-all duration-75`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
