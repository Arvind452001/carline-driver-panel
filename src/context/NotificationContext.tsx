import {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import type {
  Notification,
  TestPushPayload,
  SocketNotificationPayload,
} from '@/types/notification';
import { notificationService, normalizeNotification } from '@/services/notificationService';
import { requestFcmToken, subscribeToForegroundFcm } from '@/services/firebaseService';
import { socketService } from '@/services/socketService';
import { playNotificationSound, playRideRequestAlertSound } from '@/utils/sound';
import { useAuth } from '@/hooks/useAuth';

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  total: number;
  page: number;
  limit: number;
  fcmToken: string | null;
  pushPermission: NotificationPermission | 'unsupported';
  activeToast: Notification | null;
  dismissToast: () => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
  refresh: () => Promise<void>;
  loadPage: (page: number, limit?: number) => Promise<void>;
  requestPushPermission: () => Promise<string | null>;
  sendTestPush: (payload?: Partial<TestPushPayload>) => Promise<any>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [fcmToken, setFcmToken] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('driver_fcm_token') : null;
  });
  const [pushPermission, setPushPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });
  const [activeToast, setActiveToast] = useState<Notification | null>(null);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  /**
   * Loads notifications history and updates unread badge
   */
  const loadNotifications = useCallback(
    async (targetPage = 1, targetLimit = 20) => {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        const [historyRes, countRes] = await Promise.allSettled([
          notificationService.getMyNotifications(targetPage, targetLimit),
          notificationService.getUnreadCount(),
        ]);

        if (historyRes.status === 'fulfilled') {
          const data = historyRes.value;
          setNotifications(data.notifications);
          setTotal(data.total);
          setPage(data.page);
          setLimit(data.limit);
          setUnreadCount(data.unreadCount);
        }

        if (countRes.status === 'fulfilled') {
          setUnreadCount(countRes.value);
        }
      } catch (err) {
        console.error('[NotificationContext] Failed to load notifications:', err);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  /**
   * Periodic / manual refresh
   */
  const refresh = useCallback(async () => {
    await loadNotifications(page, limit);
  }, [loadNotifications, page, limit]);

  const loadPage = useCallback(
    async (newPage: number, newLimit = 20) => {
      await loadNotifications(newPage, newLimit);
    },
    [loadNotifications]
  );

  /**
   * Request Push Permission & register FCM Token
   */
  const handleRequestPushPermission = useCallback(async (): Promise<string | null> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPushPermission('unsupported');
      return null;
    }

    try {
      const token = await requestFcmToken();
      setPushPermission(Notification.permission);
      if (token) {
        setFcmToken(token);
      }
      return token;
    } catch (err) {
      console.error('[NotificationContext] Request push permission failed:', err);
      setPushPermission(Notification.permission);
      return null;
    }
  }, []);

  /**
   * Initial Auth & FCM sync
   */
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications(1, 20);

      // Auto-register FCM if permission is already granted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        requestFcmToken()
          .then((token) => {
            if (token) setFcmToken(token);
          })
          .catch(() => {});
      }
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setActiveToast(null);
    }
  }, [isAuthenticated, loadNotifications]);

  /**
   * Handles an incoming real-time notification (from Socket or FCM Foreground)
   */
  const handleIncomingNotification = useCallback(
    (raw: SocketNotificationPayload | any) => {
      const normalized = normalizeNotification(raw);

      // 1. Play appropriate sound
      if (normalized.type === 'RIDE_REQUEST') {
        playRideRequestAlertSound();
      } else {
        playNotificationSound();
      }

      // 2. Prepend to state list and bump unread count
      setNotifications((prev) => {
        const exists = prev.some((n) => n._id === normalized._id);
        if (exists) return prev;
        return [normalized, ...prev];
      });
      setUnreadCount((c) => c + 1);

      // 3. Trigger foreground in-app toast
      setActiveToast(normalized);

      // 4. If window is minimized or hidden, show system web notification
      if (
        typeof document !== 'undefined' &&
        document.hidden &&
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        try {
          new Notification(normalized.title, {
            body: normalized.body,
            icon: '/logo.webp',
            data: normalized.data,
          });
        } catch {
          // ignore notification creation error
        }
      }
    },
    []
  );

  /**
   * Listen to Socket.IO `notification:new` event
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubSocket = socketService.onNotificationNew((data) => {
      console.log('[NotificationContext] Socket notification:new received:', data);
      handleIncomingNotification(data);
    });

    return () => {
      unsubSocket();
    };
  }, [isAuthenticated, handleIncomingNotification]);

  /**
   * Listen to Firebase FCM foreground push notifications
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    let unsubFcm: (() => void) | null = null;
    subscribeToForegroundFcm((payload) => {
      console.log('[NotificationContext] FCM foreground message:', payload);
      const notifData = {
        title: payload.notification?.title || payload.data?.title || 'Notification',
        body: payload.notification?.body || payload.data?.body || '',
        type: payload.data?.type || 'SYSTEM_ALERT',
        data: payload.data || {},
        createdAt: new Date().toISOString(),
      };
      handleIncomingNotification(notifData);
    }).then((unsub) => {
      unsubFcm = unsub;
    });

    return () => {
      if (unsubFcm) unsubFcm();
    };
  }, [isAuthenticated, handleIncomingNotification]);

  /**
   * Mark single notification as read
   */
  const markAsRead = useCallback(async (id: string) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n._id === id || n.id === id ? { ...n, isRead: true, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));

    await notificationService.markAsRead(id);
  }, []);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true, read: true }))
    );
    setUnreadCount(0);

    await notificationService.markAllAsRead();
  }, []);

  /**
   * Clear all (or mark all read)
   */
  const clearAll = useCallback(async () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true, read: true }))
    );
    setUnreadCount(0);
    await notificationService.markAllAsRead();
  }, []);

  /**
   * Send test push notification
   */
  const sendTestPush = useCallback(async (customPayload?: Partial<TestPushPayload>) => {
    const payload: TestPushPayload = {
      title: customPayload?.title || 'Test Push',
      body: customPayload?.body || 'Hello from Carline! Firebase notifications are working.',
      type: customPayload?.type || 'TEST_PUSH',
      data: customPayload?.data || { customKey: 'test123' },
    };

    return await notificationService.sendTestPush(payload);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        total,
        page,
        limit,
        fcmToken,
        pushPermission,
        activeToast,
        dismissToast,
        markAsRead,
        markAllAsRead,
        clearAll,
        refresh,
        loadPage,
        requestPushPermission: handleRequestPushPermission,
        sendTestPush,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}