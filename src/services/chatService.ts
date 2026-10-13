import { axiosInstance } from './axiosClient';
import type { ChatMessage, ChatHistoryResponse } from '@/types/chat';

// Helper to safely unwrap backend data
const unwrapData = (res: any) => {
  return res?.data?.data !== undefined ? res.data.data : res?.data;
};

/**
 * Send in-ride chat message via REST API
 * POST /api/v1/chat/send
 */
export const sendChatMessage = async (
  rideId: string,
  message: string
): Promise<ChatMessage> => {
  const res = await axiosInstance.post('/chat/send', {
    rideId,
    message,
  });
  return unwrapData(res);
};

/**
 * Fetch chat message history for an active ride
 * GET /api/v1/chat/:rideId/messages?page=1&limit=50
 */
export const getChatMessages = async (
  rideId: string,
  page = 1,
  limit = 50
): Promise<ChatHistoryResponse> => {
  const res = await axiosInstance.get(`/chat/${rideId}/messages`, {
    params: { page, limit },
  });
  const data = unwrapData(res);

  if (Array.isArray(data)) {
    return {
      rideId,
      total: data.length,
      page,
      limit,
      messages: data,
    };
  }

  return {
    rideId: data?.rideId || rideId,
    total: data?.total ?? (data?.messages?.length || 0),
    page: data?.page || page,
    limit: data?.limit || limit,
    messages: Array.isArray(data?.messages) ? data.messages : [],
  };
};

/**
 * Mark in-ride chat messages as read
 * PATCH /api/v1/chat/:rideId/read
 */
export const markChatAsRead = async (
  rideId: string
): Promise<{ updatedCount?: number }> => {
  try {
    const res = await axiosInstance.patch(`/chat/${rideId}/read`);
    return unwrapData(res);
  } catch (err) {
    console.warn(`[chatService] Failed to mark messages as read for ride ${rideId}:`, err);
    return { updatedCount: 0 };
  }
};
