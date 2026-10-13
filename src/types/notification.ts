export type NotificationType =
  | 'RIDE_REQUEST'
  | 'RIDE_BOOKED'
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_ARRIVED'
  | 'TRIP_STARTED'
  | 'DESTINATION_REACHED'
  | 'TRIP_COMPLETED'
  | 'RIDE_CANCELLED'
  | 'CHAT_MESSAGE'
  | 'TEST_PUSH'
  | 'PAYMENT_RECEIVED'
  | 'SYSTEM_ALERT'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | string;

export interface NotificationData {
  rideId?: string;
  otp?: string;
  type?: string;
  pickup?: string | any;
  dropoff?: string | any;
  fare?: number;
  totalFare?: number;
  reason?: string;
  customKey?: string;
  [key: string]: any;
}

export interface Notification {
  _id: string;
  id: string;
  title: string;
  body: string;
  message?: string;
  type: NotificationType;
  data?: NotificationData;
  isRead: boolean;
  read?: boolean;
  createdAt: string;
  date?: string;
  readAt?: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number;
}

export interface UnreadCountResponse {
  count: number;
}

export interface FcmTokenPayload {
  fcmToken: string;
}

export interface TestPushPayload {
  title: string;
  body: string;
  type?: string;
  data?: Record<string, any>;
}

export interface SocketNotificationPayload {
  _id?: string;
  id?: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: NotificationData;
  createdAt?: string;
}