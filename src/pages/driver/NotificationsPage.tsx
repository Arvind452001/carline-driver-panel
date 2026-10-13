import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  CheckCheck,
  RefreshCw,
  Search,
  Send,
  Zap,
  MapPin,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Smartphone,
  KeyRound,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Copy,
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDateTime } from '@/utils/formatDate';
import type { Notification, NotificationType } from '@/types/notification';
import Swal from 'sweetalert2';

export function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    total,
    page,
    limit,
    fcmToken,
    pushPermission,
    markAsRead,
    markAllAsRead,
    refresh,
    loadPage,
    requestPushPermission,
    sendTestPush,
  } = useNotifications();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD' | 'RIDES' | 'CHAT'>('ALL');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testTitle, setTestTitle] = useState('Test Push Notification');
  const [testBody, setTestBody] = useState('Hello from Carline Driver! Push notifications are working.');
  const [testType, setTestType] = useState<NotificationType>('TEST_PUSH');
  const [testLoading, setTestLoading] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // Tab filtering
  const filteredNotifications = notifications.filter((item) => {
    // Tab filters
    if (activeTab === 'UNREAD' && item.isRead) return false;
    if (activeTab === 'RIDES') {
      const rideTypes = ['RIDE_REQUEST', 'RIDE_BOOKED', 'DRIVER_ASSIGNED', 'DRIVER_ARRIVED', 'TRIP_STARTED', 'DESTINATION_REACHED', 'TRIP_COMPLETED', 'RIDE_CANCELLED'];
      if (!rideTypes.includes(item.type)) return false;
    }
    if (activeTab === 'CHAT' && item.type !== 'CHAT_MESSAGE') return false;

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchBody = (item.body || item.message || '').toLowerCase().includes(q);
      const matchType = item.type.toLowerCase().includes(q);
      if (!matchTitle && !matchBody && !matchType) return false;
    }

    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'RIDE_REQUEST':
        return {
          icon: Zap,
          bg: 'bg-orange-50 text-orange-600 border-orange-200',
          badge: 'Ride Request',
        };
      case 'RIDE_CANCELLED':
        return {
          icon: AlertTriangle,
          bg: 'bg-rose-50 text-rose-600 border-rose-200',
          badge: 'Ride Cancelled',
        };
      case 'DRIVER_ARRIVED':
      case 'TRIP_STARTED':
      case 'DESTINATION_REACHED':
        return {
          icon: MapPin,
          bg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
          badge: 'Trip Status',
        };
      case 'TRIP_COMPLETED':
        return {
          icon: CheckCircle2,
          bg: 'bg-green-50 text-green-700 border-green-200',
          badge: 'Completed',
        };
      case 'CHAT_MESSAGE':
        return {
          icon: MessageSquare,
          bg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
          badge: 'Passenger Chat',
        };
      case 'TEST_PUSH':
        return {
          icon: Sparkles,
          bg: 'bg-purple-50 text-purple-600 border-purple-200',
          badge: 'Test Push',
        };
      default:
        return {
          icon: Bell,
          bg: 'bg-orange-50 text-[#FF5B26] border-orange-100',
          badge: 'Notice',
        };
    }
  };

  const handleAction = (item: Notification) => {
    if (!item.isRead) {
      markAsRead(item._id);
    }
    switch (item.type) {
      case 'RIDE_REQUEST':
      case 'RIDE_CANCELLED':
      case 'DRIVER_ARRIVED':
      case 'TRIP_STARTED':
      case 'DESTINATION_REACHED':
      case 'CHAT_MESSAGE':
        navigate('/dashboard');
        break;
      case 'TRIP_COMPLETED':
        navigate('/earnings');
        break;
      default:
        break;
    }
  };

  const handleCopyToken = () => {
    if (fcmToken) {
      navigator.clipboard.writeText(fcmToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const handleEnablePush = async () => {
    const token = await requestPushPermission();
    if (token) {
      Swal.fire({
        icon: 'success',
        title: 'Push Notifications Enabled!',
        text: 'Your device is now registered to receive push notifications.',
        confirmButtonColor: '#FF5B26',
        timer: 3000,
      });
    } else if (Notification.permission === 'denied') {
      Swal.fire({
        icon: 'warning',
        title: 'Permission Blocked',
        text: 'Please allow notification permissions in your browser address bar settings.',
        confirmButtonColor: '#FF5B26',
      });
    }
  };

  const handleSendTestPush = async () => {
    setTestLoading(true);
    try {
      await sendTestPush({
        title: testTitle,
        body: testBody,
        type: testType,
        data: {
          testKey: 'val_' + Date.now(),
          timestamp: new Date().toISOString(),
          otp: testType === 'DRIVER_ARRIVED' ? '2186' : undefined,
          fare: testType === 'RIDE_REQUEST' ? 450 : undefined,
        },
      });

      setIsTestModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Test Notification Sent!',
        text: 'Backend dispatched test push. Check your foreground toast & history.',
        confirmButtonColor: '#FF5B26',
        timer: 2500,
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to send test push',
        text: err?.response?.data?.message || err?.message || 'Error sending test push',
        confirmButtonColor: '#FF5B26',
      });
    } finally {
      setTestLoading(false);
    }
  };

  const setTestPreset = (preset: 'TEST' | 'REQUEST' | 'ARRIVED' | 'CANCEL' | 'CHAT') => {
    switch (preset) {
      case 'REQUEST':
        setTestTitle('New Ride Request');
        setTestBody('Pickup: Indiranagar 100ft Rd • Fare: ₹380. 30s to accept!');
        setTestType('RIDE_REQUEST');
        break;
      case 'ARRIVED':
        setTestTitle('Driver Arrived');
        setTestBody('Driver has arrived at pickup. Share OTP: 2186 to start trip.');
        setTestType('DRIVER_ARRIVED');
        break;
      case 'CANCEL':
        setTestTitle('Ride Cancelled by Rider');
        setTestBody('The customer cancelled this ride. Returning to active radar.');
        setTestType('RIDE_CANCELLED');
        break;
      case 'CHAT':
        setTestTitle('New Message from Rider');
        setTestBody('I am waiting near the coffee shop entrance in the blue shirt.');
        setTestType('CHAT_MESSAGE');
        break;
      default:
        setTestTitle('Test Push');
        setTestBody('Hello from Carline! Firebase notifications are working.');
        setTestType('TEST_PUSH');
        break;
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5B26] flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                Notifications
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time ride alerts, passenger messages, and system notifications
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => refresh()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All Read ({unreadCount})</span>
            </button>
          )}

          <button
            onClick={() => setIsTestModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#FF5B26] hover:bg-[#e04e1e] shadow-sm shadow-orange-500/20 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Send Test Push</span>
          </button>
        </div>
      </div>

      {/* Push Notification & FCM Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-navy text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">Push Notifications & FCM</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    pushPermission === 'granted'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {pushPermission === 'granted' ? 'Active & Synced' : 'Action Required'}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed">
                {pushPermission === 'granted'
                  ? 'Your browser receives instant push alerts for new rides and customer updates.'
                  : 'Enable browser notifications so you never miss high-priority ride requests.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            {pushPermission !== 'granted' ? (
              <button
                onClick={handleEnablePush}
                className="px-4 py-2 rounded-xl bg-[#FF5B26] hover:bg-[#e04e1e] text-white text-xs font-bold transition-colors shadow-md"
              >
                Enable Push Notifications
              </button>
            ) : fcmToken ? (
              <button
                onClick={handleCopyToken}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-gray-200 font-medium transition-colors border border-white/10"
                title="Copy FCM Device Token"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedToken ? 'Token Copied!' : 'Copy Device Token'}</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'ALL'
                ? 'bg-[#FF5B26] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All ({total || notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('UNREAD')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'UNREAD'
                ? 'bg-[#FF5B26] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === 'UNREAD' ? 'bg-white text-[#FF5B26]' : 'bg-[#FF5B26] text-white'
                }`}
              >
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('RIDES')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'RIDES'
                ? 'bg-[#FF5B26] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Ride Alerts
          </button>
          <button
            onClick={() => setActiveTab('CHAT')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'CHAT'
                ? 'bg-[#FF5B26] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Messages
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notifications..."
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#FF5B26]"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading && notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
            <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF5B26] flex items-center justify-center mx-auto mb-3">
              <Bell className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900">No Notifications Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              {searchTerm
                ? `No notifications matched "${searchTerm}". Try another query.`
                : 'You are all caught up! When you receive ride alerts or messages, they will show up here.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const conf = getNotificationIcon(item.type);
            const Icon = conf.icon;
            const otp = item.data?.otp;
            const fare = item.data?.fare || item.data?.totalFare;
            const rideId = item.data?.rideId;

            return (
              <div
                key={item._id}
                className={`bg-white rounded-2xl p-4 md:p-5 border transition-all duration-200 shadow-xs hover:shadow-md ${
                  !item.isRead
                    ? 'border-orange-200 bg-orange-50/15 ring-1 ring-orange-500/10'
                    : 'border-gray-100'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Icon */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${conf.bg}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {conf.badge}
                        </span>
                        {!item.isRead && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#FF5B26]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B26] animate-pulse" />
                            New
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-gray-400 font-medium">
                        {formatDateTime(item.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-sm md:text-base font-bold text-gray-900 mt-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 mt-0.5 leading-relaxed">
                      {item.body || item.message}
                    </p>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                      {otp && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold font-mono border border-emerald-200">
                          <KeyRound className="w-3.5 h-3.5" />
                          OTP: {otp}
                        </span>
                      )}
                      {fare && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                          Fare: ₹{fare}
                        </span>
                      )}
                      {rideId && (
                        <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                          ID: {rideId.slice(-6)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {!item.isRead && (
                      <button
                        onClick={() => markAsRead(item._id)}
                        className="p-1.5 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleAction(item)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5B26] hover:text-[#e04e1e] transition-colors mt-2"
                    >
                      <span>Action</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500">
            Showing Page <span className="font-bold text-gray-800">{page}</span> of{' '}
            <span className="font-bold text-gray-800">{totalPages}</span> ({total} total)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadPage(page - 1)}
              disabled={page <= 1 || loading}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => loadPage(page + 1)}
              disabled={page >= totalPages || loading}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Send Test Push Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF5B26]" />
                <h3 className="text-base font-bold text-gray-900">Send Test Push Notification</h3>
              </div>
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Presets */}
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">
                  Select Event Preset
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTestPreset('REQUEST')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-orange-50 text-orange-700 font-semibold border border-orange-200 hover:bg-orange-100"
                  >
                    Ride Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestPreset('ARRIVED')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 hover:bg-emerald-100"
                  >
                    Driver Arrived (OTP)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestPreset('CANCEL')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-rose-50 text-rose-700 font-semibold border border-rose-200 hover:bg-rose-100"
                  >
                    Rider Cancelled
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestPreset('CHAT')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 hover:bg-indigo-100"
                  >
                    Chat Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestPreset('TEST')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-purple-50 text-purple-700 font-semibold border border-purple-200 hover:bg-purple-100"
                  >
                    General Test
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Title</label>
                <input
                  type="text"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#FF5B26]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Body</label>
                <textarea
                  rows={3}
                  value={testBody}
                  onChange={(e) => setTestBody(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#FF5B26]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Type (`payload.type`)
                </label>
                <input
                  type="text"
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-[#FF5B26]"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-500">
                Calls <code className="font-mono text-[#FF5B26]">POST /api/v1/notification/test-push</code> with JWT authentication.
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsTestModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendTestPush}
                disabled={testLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#FF5B26] hover:bg-[#e04e1e] shadow-md shadow-orange-500/20 disabled:opacity-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{testLoading ? 'Sending...' : 'Dispatch Test Push'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}