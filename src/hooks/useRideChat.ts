import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import {
  sendChatMessage as sendChatMessageApi,
  getChatMessages,
  markChatAsRead as markChatAsReadApi,
} from '@/services/chatService';
import type { ChatMessage } from '@/types/chat';

interface UseRideChatOptions {
  rideId: string | null;
  isOpen?: boolean;
  onNewIncomingMessage?: (msg: ChatMessage) => void;
}

export function useRideChat({
  rideId,
  isOpen = false,
  onNewIncomingMessage,
}: UseRideChatOptions) {
  const { user } = useAuth();
  const {
    isConnected,
    joinRide,
    sendChatMessage: socketSendChat,
    sendChatTyping: socketSendTyping,
    sendChatRead: socketSendRead,
    onChatMessage,
    onChatTyping,
    onChatRead,
  } = useSocket();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isPassengerTyping, setIsPassengerTyping] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);

  const isOpenRef = useRef<boolean>(isOpen);
  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen && rideId) {
      setUnreadCount(0);
      socketSendRead({ rideId });
      markChatAsReadApi(rideId).catch(() => {});
    }
  }, [isOpen, rideId, socketSendRead]);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const driverTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Join ride room and fetch chat history on mount or rideId change
  const fetchHistory = useCallback(async () => {
    if (!rideId) {
      setMessages([]);
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);
      const res = await getChatMessages(rideId, 1, 50);
      const history = Array.isArray(res.messages) ? res.messages : [];
      setMessages(history);

      // Calculate unread count (messages sent by PASSENGER where isRead is false)
      const unread = history.filter(
        (m) => m.senderRole === 'PASSENGER' && !m.isRead
      ).length;
      if (!isOpenRef.current) {
        setUnreadCount(unread);
      } else {
        setUnreadCount(0);
        socketSendRead({ rideId });
        markChatAsReadApi(rideId).catch(() => {});
      }
    } catch (err) {
      console.warn('[useRideChat] Failed to load chat history:', err);
    } finally {
      setLoading(false);
    }
  }, [rideId, socketSendRead]);

  useEffect(() => {
    if (rideId) {
      // Join ride room
      joinRide(rideId);
      fetchHistory();
    }
  }, [rideId, joinRide, fetchHistory]);

  // Re-join on socket reconnection
  useEffect(() => {
    if (isConnected && rideId) {
      joinRide(rideId);
    }
  }, [isConnected, rideId, joinRide]);

  // 2. Listen for incoming chat messages
  useEffect(() => {
    if (!rideId) return;

    const unsub = onChatMessage((incoming) => {
      if (!incoming) return;
      const targetRideId = incoming.rideId;
      if (targetRideId && targetRideId !== rideId) return;

      setMessages((prev) => {
        // Prevent duplicate messages
        const exists = prev.some(
          (m) =>
            (incoming._id && m._id === incoming._id) ||
            (incoming.id && m.id === incoming.id) ||
            (m.message === incoming.message &&
              m.senderRole === incoming.senderRole &&
              Math.abs(
                new Date(m.createdAt || 0).getTime() -
                  new Date(incoming.createdAt || 0).getTime()
              ) < 2000)
        );
        if (exists) {
          return prev.map((m) =>
            m._id === incoming._id || (m._id?.startsWith('temp-') && m.message === incoming.message)
              ? incoming
              : m
          );
        }
        return [...prev, incoming];
      });

      // Passenger sent a message
      if (incoming.senderRole === 'PASSENGER') {
        setIsPassengerTyping(false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        if (!isOpenRef.current) {
          setUnreadCount((c) => c + 1);
          onNewIncomingMessage?.(incoming);
        } else {
          // If modal is open, mark as read immediately
          socketSendRead({ rideId });
          markChatAsReadApi(rideId).catch(() => {});
        }
      }
    });

    return () => {
      unsub();
    };
  }, [rideId, onChatMessage, socketSendRead, onNewIncomingMessage]);

  // 3. Listen for typing status
  useEffect(() => {
    if (!rideId) return;

    const unsub = onChatTyping((data) => {
      if (data.rideId && data.rideId !== rideId) return;

      if (data.senderRole === 'PASSENGER') {
        setIsPassengerTyping(Boolean(data.isTyping));

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Safety fallback: auto-clear after 4 seconds
        if (data.isTyping) {
          typingTimeoutRef.current = setTimeout(() => {
            setIsPassengerTyping(false);
          }, 4000);
        }
      }
    });

    return () => {
      unsub();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [rideId, onChatTyping]);

  // 4. Listen for read receipts
  useEffect(() => {
    if (!rideId) return;

    const unsub = onChatRead((data) => {
      if (data.rideId && data.rideId !== rideId) return;

      setMessages((prev) =>
        prev.map((m) => (m.senderRole === 'DRIVER' ? { ...m, isRead: true } : m))
      );
    });

    return () => {
      unsub();
    };
  }, [rideId, onChatRead]);

  // 5. Send message
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !rideId) return;

      setSending(true);

      // Stop driver typing indicator
      socketSendTyping({ rideId, isTyping: false });
      if (driverTypingTimeoutRef.current) {
        clearTimeout(driverTypingTimeoutRef.current);
      }

      const tempId = `temp-${Date.now()}`;
      const driverId = user?.id || (user as any)?._id || 'driver';
      const driverName = user?.name || (user as any)?.fullName || 'Driver';

      const optimisticMsg: ChatMessage = {
        _id: tempId,
        rideId,
        senderId: driverId,
        senderRole: 'DRIVER',
        senderName: driverName,
        message: trimmed,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      // Optimistic UI update
      setMessages((prev) => [...prev, optimisticMsg]);

      try {
        // Emit via socket
        socketSendChat({
          rideId,
          message: trimmed,
        });

        // Also call REST fallback to ensure persistence and database write
        const apiRes = await sendChatMessageApi(rideId, trimmed);

        if (apiRes && apiRes._id) {
          setMessages((prev) =>
            prev.map((m) => (m._id === tempId ? apiRes : m))
          );
        }
      } catch (err) {
        console.warn('[useRideChat] REST send error (socket may have handled):', err);
      } finally {
        setSending(false);
      }
    },
    [rideId, user, socketSendChat, socketSendTyping]
  );

  // 6. Handle driver typing emission
  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!rideId) return;
      socketSendTyping({ rideId, isTyping });

      if (driverTypingTimeoutRef.current) {
        clearTimeout(driverTypingTimeoutRef.current);
      }

      if (isTyping) {
        driverTypingTimeoutRef.current = setTimeout(() => {
          socketSendTyping({ rideId, isTyping: false });
        }, 3000);
      }
    },
    [rideId, socketSendTyping]
  );

  // 7. Mark messages as read
  const markAsRead = useCallback(() => {
    if (!rideId) return;
    setUnreadCount(0);
    socketSendRead({ rideId });
    markChatAsReadApi(rideId).catch(() => {});
  }, [rideId, socketSendRead]);

  return {
    messages,
    unreadCount,
    isPassengerTyping,
    loading,
    sending,
    sendMessage,
    sendTyping,
    markAsRead,
    refreshHistory: fetchHistory,
  };
}
