// Firebase Cloud Messaging Service Worker for Carline Driver App
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyA8Y4k9hG3M9_sampleKeyCarline2ed3c',
  authDomain: 'carline-2ed3c.firebaseapp.com',
  projectId: 'carline-2ed3c',
  storageBucket: 'carline-2ed3c.appspot.com',
  messagingSenderId: '823485723910',
  appId: '1:823485723910:web:d238b19283f12f00',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const title = payload.notification?.title || payload.data?.title || 'Carline Driver';
  const options = {
    body: payload.notification?.body || payload.data?.body || 'New notification received',
    icon: '/logo.webp',
    badge: '/logo.webp',
    data: payload.data || {},
    vibrate: [200, 100, 200],
    requireInteraction: payload.data?.type === 'RIDE_REQUEST',
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const rideId = event.notification.data?.rideId;
  const targetUrl = rideId ? `/dashboard?rideId=${rideId}` : '/notifications';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
