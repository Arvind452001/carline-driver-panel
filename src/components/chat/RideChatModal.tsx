import { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Phone,
  MessageSquare,
  Check,
  CheckCheck,
  Clock,
  Sparkles,
  Shield,
  Loader2,
} from 'lucide-react';
import { useRideChat } from '@/hooks/useRideChat';
import type { ChatMessage } from '@/types/chat';

interface RideChatModalProps {
  rideId: string | null;
  isOpen: boolean;
  onClose: () => void;
  passengerName?: string;
  passengerPhone?: string;
  passengerAvatar?: string | null;
  messages?: ChatMessage[];
  isPassengerTyping?: boolean;
  loading?: boolean;
  sending?: boolean;
  sendMessage?: (text: string) => Promise<void> | void;
  sendTyping?: (isTyping: boolean) => void;
  markAsRead?: () => void;
}

const QUICK_DRIVER_REPLIES = [
  'I have arrived at the pickup location',
  'I am waiting outside for you',
  'Heavy traffic, arriving in 2-3 minutes',
  'Please confirm your exact pickup spot',
  'OK, got it!',
];

export function RideChatModal({
  rideId,
  isOpen,
  onClose,
  passengerName = 'Passenger',
  passengerPhone,
  passengerAvatar,
  messages: controlledMessages,
  isPassengerTyping: controlledIsTyping,
  loading: controlledLoading,
  sending: controlledSending,
  sendMessage: controlledSendMessage,
  sendTyping: controlledSendTyping,
  markAsRead: controlledMarkAsRead,
}: RideChatModalProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fallbackChat = useRideChat({
    rideId: controlledMessages ? null : rideId,
    isOpen,
  });

  const messages = controlledMessages ?? fallbackChat.messages;
  const isPassengerTyping = controlledIsTyping ?? fallbackChat.isPassengerTyping;
  const loading = controlledLoading ?? fallbackChat.loading;
  const sending = controlledSending ?? fallbackChat.sending;
  const sendMessage = controlledSendMessage ?? fallbackChat.sendMessage;
  const sendTyping = controlledSendTyping ?? fallbackChat.sendTyping;
  const markAsRead = controlledMarkAsRead ?? fallbackChat.markAsRead;

  // Auto-scroll to bottom on messages update
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  useEffect(() => {
    if (isOpen) {
      markAsRead();
      setTimeout(() => scrollToBottom(false), 100);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, markAsRead]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom(true);
    }
  }, [messages, isPassengerTyping, isOpen]);

  if (!isOpen || !rideId) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || sending) return;

    setInputText('');
    sendTyping(false);
    await sendMessage(text);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);
    if (val.length > 0) {
      sendTyping(true);
    } else {
      sendTyping(false);
    }
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  const formatMessageTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[480px] max-h-[75vh] flex flex-col overflow-hidden border border-gray-100 animate-scaleUp my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF5B26] to-orange-400 text-white flex items-center justify-center font-bold text-xs shadow-md overflow-hidden ring-2 ring-white/20">
                {passengerAvatar ? (
                  <img
                    src={passengerAvatar}
                    alt={passengerName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  passengerName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-gray-900" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  {passengerName}
                </h3>
                <span className="text-[9px] font-semibold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30 px-1.5 py-0.2 rounded-full">
                  Customer
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px]">
                {isPassengerTyping ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 animate-pulse">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Typing...
                  </span>
                ) : (
                  <span className="text-gray-400 text-[10px] font-medium flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5 text-emerald-400" />
                    In-Ride Direct Chat
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {passengerPhone && (
              <a
                href={`tel:${passengerPhone}`}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shadow-inner"
                title="Call Passenger"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-300" />
              </a>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
              title="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Driver Reply Chips Bar */}
        <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100 shrink-0 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 shrink-0 flex items-center gap-1 pl-0.5">
            <Sparkles className="w-2.5 h-2.5 text-[#FF5B26]" />
            Quick:
          </span>
          {QUICK_DRIVER_REPLIES.map((reply, i) => (
            <button
              key={i}
              onClick={() => handleQuickReply(reply)}
              className="shrink-0 px-2 py-0.5 rounded-full bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 text-gray-700 hover:text-[#FF5B26] text-[10px] font-medium transition-all shadow-2xs whitespace-nowrap active:scale-95"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Message Thread List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-gray-50/50 to-white">
          {loading && messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#FF5B26]" />
              <span>Loading chat history...</span>
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF5B26] flex items-center justify-center mb-3 shadow-inner">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-gray-800">No Messages Yet</h4>
              <p className="text-xs text-gray-500 max-w-xs mt-1">
                Coordinate pickup location or arrival updates directly with the customer.
              </p>
            </div>
          )}

          {messages.map((msg, index) => {
            const isDriver = msg.senderRole === 'DRIVER';
            const isTemp = msg._id?.startsWith('temp-');

            return (
              <div
                key={msg._id || msg.id || index}
                className={`flex flex-col ${isDriver ? 'items-end' : 'items-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[72%] px-4 py-2.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-xs relative break-words ${
                    isDriver
                      ? 'bg-gradient-to-r from-[#FF5B26] to-[#E04815] text-white rounded-br-xs'
                      : 'bg-white text-gray-800 border border-gray-150 rounded-bl-xs shadow-sm'
                  }`}
                >
                  <p className="font-normal">{msg.message}</p>

                  <div
                    className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
                      isDriver ? 'text-white/80' : 'text-gray-400'
                    }`}
                  >
                    <span>{formatMessageTime(msg.createdAt)}</span>
                    {isDriver && (
                      <span title={isTemp ? 'Sending...' : msg.isRead ? 'Read' : 'Sent'}>
                        {isTemp ? (
                          <Clock className="w-3 h-3 text-white/70 animate-pulse" />
                        ) : msg.isRead ? (
                          <CheckCheck className="w-3.5 h-3.5 text-cyan-200" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-white/80" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Passenger Typing Bubble */}
          {isPassengerTyping && (
            <div className="flex items-center gap-2 animate-fade-in">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-xs px-3.5 py-2 shadow-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                />
              </div>
              <span className="text-[11px] text-gray-400 italic">
                {passengerName} is typing...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Form */}
        <form
          onSubmit={handleSend}
          className="p-2.5 sm:p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type message to customer..."
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5B26]/30 focus:border-[#FF5B26] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="w-9 h-9 rounded-xl bg-[#FF5B26] hover:bg-[#e04815] disabled:bg-gray-200 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shadow-md shadow-orange-500/25 shrink-0 active:scale-95"
            title="Send Message"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
