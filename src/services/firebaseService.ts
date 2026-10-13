import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';
import { notificationService } from './notificationService';

// Default Firebase configuration for carline-2ed3c
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyA8Y4k9hG3M9_sampleKeyCarline2ed3c',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'carline-2ed3c.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'carline-2ed3c',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'carline-2ed3c.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '823485723910',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:823485723910:web:d238b19283f12f00',
};

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

/**
 * Initializes Firebase App instance safely
 */
export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    if (getApps().length > 0) {
      app = getApp();
    } else {
      app = initializeApp(firebaseConfig);
    }
  }
  return app;
}

/**
 * Checks if Firebase Web Messaging is supported in the current environment
 */
export async function isFirebaseMessagingSupported(): Promise<boolean> {
  try {
    if (typeof window === 'undefined') return false;
    if (!('Notification' in window)) return false;
    if (!('serviceWorker' in navigator)) return false;
    return await isSupported();
  } catch {
    return false;
  }
}

/**
 * Requests notification permission from user and retrieves FCM device token
 */
export async function requestFcmToken(): Promise<string | null> {
  try {
    const supported = await isFirebaseMessagingSupported();
    if (!supported) {
      console.warn('[FCM] Firebase Messaging is not supported in this browser environment.');
      return null;
    }

    if (typeof window === 'undefined' || !('Notification' in window)) {
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('[FCM] Notification permission was not granted:', permission);
      return null;
    }

    const firebaseApp = getFirebaseApp();
    if (!messaging) {
      messaging = getMessaging(firebaseApp);
    }

    // Register service worker if available
    let swRegistration: ServiceWorkerRegistration | undefined;
    if ('serviceWorker' in navigator) {
      try {
        swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/',
        });
        console.log('[FCM] Service worker registered successfully:', swRegistration.scope);
      } catch (swErr) {
        console.warn('[FCM] Service worker registration notice:', swErr);
      }
    }

    const tokenOptions: { vapidKey?: string; serviceWorkerRegistration?: ServiceWorkerRegistration } = {};
    if (VAPID_KEY) {
      tokenOptions.vapidKey = VAPID_KEY;
    }
    if (swRegistration) {
      tokenOptions.serviceWorkerRegistration = swRegistration;
    }

    let fcmToken: string | null = null;
    try {
      fcmToken = await getToken(messaging, Object.keys(tokenOptions).length > 0 ? tokenOptions : undefined);
    } catch (tokenErr) {
      console.warn('[FCM] getToken with custom config notice:', tokenErr);
      // Fallback attempt without options
      fcmToken = await getToken(messaging).catch(() => null);
    }

    if (fcmToken) {
      console.log('[FCM] Retrieved device FCM token:', fcmToken);
      localStorage.setItem('driver_fcm_token', fcmToken);
      // Register token with backend
      await notificationService.registerFcmToken(fcmToken).catch((err) => {
        console.warn('[FCM] Failed to sync FCM token with backend:', err);
      });
      return fcmToken;
    }

    return null;
  } catch (error) {
    console.error('[FCM] Error requesting FCM token:', error);
    return null;
  }
}

/**
 * Listens for Firebase push notifications received in the foreground
 */
export async function subscribeToForegroundFcm(
  callback: (payload: any) => void
): Promise<(() => void) | null> {
  try {
    const supported = await isFirebaseMessagingSupported();
    if (!supported) return null;

    const firebaseApp = getFirebaseApp();
    if (!messaging) {
      messaging = getMessaging(firebaseApp);
    }

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('[FCM] Foreground push message received:', payload);
      callback(payload);
    });

    return unsubscribe;
  } catch (err) {
    console.warn('[FCM] subscribeToForegroundFcm notice:', err);
    return null;
  }
}
