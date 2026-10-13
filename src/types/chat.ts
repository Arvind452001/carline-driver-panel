export type SenderRole = 'DRIVER' | 'PASSENGER' | string;

export interface ChatMessage {
  _id?: string;
  id?: string;
  rideId: string;
  senderId: string;
  receiverId?: string;
  senderRole: SenderRole;
  senderName?: string;
  senderAvatar?: string | null;
  message: string;
  isRead?: boolean;
  createdAt?: string;
  timestamp?: string;
}

export interface ChatTypingPayload {
  rideId: string;
  senderId?: string;
  senderRole?: SenderRole;
  isTyping: boolean;
}

export interface ChatReadPayload {
  rideId: string;
  readBy?: string;
  readAt?: string;
  updatedCount?: number;
}

export interface SendMessagePayload {
  rideId: string;
  message: string;
}

export interface ChatHistoryResponse {
  rideId: string;
  total?: number;
  page?: number;
  limit?: number;
  messages: ChatMessage[];
}
