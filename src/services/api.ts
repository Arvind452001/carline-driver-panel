import { Driver } from '@/types/driver';
import { Application } from '@/types/application';
import { Trip } from '@/types/trip';
import { Transaction } from '@/types/transaction';
import { Notification } from '@/types/notification';
import {
  mockDriver,
  mockApplication,
  mockTrips,
  mockTransactions,
} from '@/data/mockData';
import { axiosInstance } from './axiosClient';
import { notificationService } from './notificationService';

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });

    return response.data;
  },

//===================
  forgotpassword: async (email: string) => {
    const response = await axiosInstance.post('/user/forgot-password', {
      email,
    });

    return response.data;
  },
  //=============
  // sendPasswordResetOtp: async (email: string) => {
  //   const response = await axiosInstance.post('/auth/resend-otp', {
  //     email,
  //   });

  //   return response.data;
  // },

  verifyPasswordResetOtp: async (email: string, otp: string, type: string = 'password') => {
    const response = await axiosInstance.post('/auth/verify-otp', {
      email,
      otp,
      type,
    });

    return response.data;
  },

resetPassword: async (
  email: string,
  password: string,
  confirmPassword: string
) => {
  const response = await axiosInstance.patch('/user/reset-password', {
    email,
    password,
    confirmPassword,
  });

  return response.data;
},

  logoutAllDevices: async () => {
    const response = await axiosInstance.post('/driver/logout-all');

    return response.data;
  },

  signup: async (_data: any) => {
    await delay(1000);
    return {
      success: true,
      applicationId: 'DRV2026001234',
    };
  },

  getApplicationStatus: async (_id: string): Promise<Application> => {
    await delay(600);
    return mockApplication;
  },

  submitApplication: async (_data: any) => {
    await delay(1200);
    return {
      success: true,
      applicationId: 'DRV2026001234',
    };
  },

 getDriverProfile: async () => {
  const response = await axiosInstance.get('/driver/profile');

  return response.data;
},

updateDriverProfile: async (data: Partial<Driver>) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && key !== 'email') {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await axiosInstance.patch(
    '/driver/profile',
    formData
  );

  return response.data.data;
},

  getDashboardData: async () => {
    await delay(400);

    return {
      todayEarnings: mockDriver.todayEarnings,
      trips: mockDriver.totalTrips,
      onlineHours: mockDriver.onlineHours,
      rating: mockDriver.rating,
      transactions: 32,
    };
  },

  getEarnings: async (_filter: string) => {
    await delay(500);

    const total = 2450;

    const breakdown = {
      trip: 2150,
      incentives: 200,
      tips: 100,
      others: 0,
    };

    const weeklyData = [
      { day: 'Mon', amount: 400 },
      { day: 'Tue', amount: 300 },
      { day: 'Wed', amount: 500 },
      { day: 'Thu', amount: 350 },
      { day: 'Fri', amount: 450 },
      { day: 'Sat', amount: 600 },
      { day: 'Sun', amount: 350 },
    ];

    return {
      total,
      breakdown,
      weeklyData,
    };
  },

  getTrips: async (_filter: string): Promise<Trip[]> => {
    await delay(500);
    return mockTrips;
  },

  getTransactions: async (
    _filter: string
  ): Promise<Transaction[]> => {
    await delay(500);
    return mockTransactions;
  },

  getNotifications: async (): Promise<Notification[]> => {
    const res = await notificationService.getMyNotifications(1, 50);
    return res.notifications;
  },

  markNotificationRead: async (id: string) => {
    return notificationService.markAsRead(id);
  },

  markAllNotificationsRead: async () => {
    return notificationService.markAllAsRead();
  },

  clearNotifications: async () => {
    return notificationService.markAllAsRead();
  },

  getSupportTickets: async () => {
    await delay(500);

    return [
      {
        id: 'T-001',
        subject: 'Payment delay',
        status: 'Open',
        created: '2026-08-18',
      },
      {
        id: 'T-002',
        subject: 'App issue',
        status: 'Closed',
        created: '2026-08-15',
      },
    ];
  },

  createSupportTicket: async (_data: any) => {
    await delay(700);

    return {
      success: true,
      ticketId: 'T-003',
    };
  },
};