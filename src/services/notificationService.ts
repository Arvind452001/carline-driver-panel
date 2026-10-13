import { axiosInstance } from './axiosClient';
import type {
  Notification,
  NotificationListResponse,
  UnreadCountResponse,
  TestPushPayload,
} from '@/types/notification';

/**
 * Normalizes backend notification objects for consistency
 */
export const normalizeNotification = (raw: any): Notification => {
  const id = raw?._id || raw?.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const title = raw?.title || 'Notification';
  const body = raw?.body || raw?.message || '';
  const message = raw?.message || raw?.body || '';
  const type = raw?.type || 'SYSTEM_ALERT';
  const data = raw?.data || {};
  const isRead = raw?.isRead !== undefined ? Boolean(raw.isRead) : Boolean(raw?.read);
  const createdAt = raw?.createdAt || raw?.date || new Date().toISOString();
  const date = raw?.date || raw?.createdAt || createdAt;

  return {
    _id: id,
    id,
    title,
    body,
    message,
    type,
    data,
    isRead,
    read: isRead,
    createdAt,
    date,
    readAt: raw?.readAt,
  };
};

export const notificationService = {
  /**
   * 2.1 Register / Update Device FCM Token
   * POST /api/v1/notification/fcm-token
   */
  async registerFcmToken(fcmToken: string): Promise<{ success: boolean; fcmToken?: string }> {
    try {
      const response = await axiosInstance.post('/notification/fcm-token', { fcmToken });
      return {
        success: true,
        fcmToken: response.data?.data?.fcmToken || fcmToken,
      };
    } catch (error) {
      console.error('[NotificationService] registerFcmToken failed:', error);
      throw error;
    }
  },

  /**
   * 2.2 Get Bell Icon Unread Count
   * GET /api/v1/notification/unread-count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await axiosInstance.get('/notification/unread-count');
      const data: UnreadCountResponse = response.data?.data ?? response.data;
      return typeof data?.count === 'number' ? data.count : 0;
    } catch (error) {
      console.error('[NotificationService] getUnreadCount failed:', error);
      return 0;
    }
  },

  /**
   * 2.3 Get In-App Notifications History
   * GET /api/v1/notification/my?page=1&limit=20
   */
  async getMyNotifications(page = 1, limit = 20): Promise<NotificationListResponse> {
    try {
      const response = await axiosInstance.get('/notification/my', {
        params: { page, limit },
      });
      const data = response.data?.data ?? response.data;

      const rawList = Array.isArray(data?.notifications)
        ? data.notifications
        : Array.isArray(data)
          ? data
          : [];

      const notifications = rawList.map(normalizeNotification);
      const total = typeof data?.total === 'number' ? data.total : notifications.length;
      const unreadCount =
        typeof data?.unreadCount === 'number'
          ? data.unreadCount
          : notifications.filter((n: Notification) => !n.isRead).length;

      return {
        notifications,
        total,
        page: typeof data?.page === 'number' ? data.page : page,
        limit: typeof data?.limit === 'number' ? data.limit : limit,
        unreadCount,
      };
    } catch (error) {
      console.error('[NotificationService] getMyNotifications failed:', error);
      return {
        notifications: [],
        total: 0,
        page,
        limit,
        unreadCount: 0,
      };
    }
  },

  /**
   * 2.4 Mark a Single Notification as Read
   * PATCH /api/v1/notification/:id/read
   */
  async markAsRead(id: string): Promise<boolean> {
    try {
      await axiosInstance.patch(`/notification/${id}/read`);
      return true;
    } catch (error) {
      console.error(`[NotificationService] markAsRead (${id}) failed:`, error);
      return false;
    }
  },

  /**
   * 2.5 Mark All Notifications as Read
   * PATCH /api/v1/notification/read-all
   */
  async markAllAsRead(): Promise<number> {
    try {
      const response = await axiosInstance.patch('/notification/read-all');
      const data = response.data?.data ?? response.data;
      return typeof data?.modifiedCount === 'number' ? data.modifiedCount : 0;
    } catch (error) {
      console.error('[NotificationService] markAllAsRead failed:', error);
      return 0;
    }
  },

  /**
   * 2.6 Send Test Push Notification (Developer Testing)
   * POST /api/v1/notification/test-push
   */
  async sendTestPush(payload: TestPushPayload): Promise<any> {
    const response = await axiosInstance.post('/notification/test-push', {
      title: payload.title || 'Test Push',
      body: payload.body || 'Hello from Carline! Firebase notifications are working.',
      type: payload.type || 'TEST_PUSH',
      data: payload.data || { customKey: 'test123' },
    });
    return response.data;
  },
};

export default notificationService;
