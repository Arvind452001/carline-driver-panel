import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  ArrowUpRight,
  Clock,
  DollarSign,
  MapPin,
  ChevronRight,
  CircleDollarSign,
  Wallet,
  Timer,
  CheckCircle2,
  PlusCircle,
  RefreshCw,
  Zap,
  WifiOff,
} from 'lucide-react';

import { api } from '@/services/api';
import {
  getDriverRideHome,
  getDriverRideDashboard,
  getRideRequests,
  getActiveRide,
  updateDriverDuty,
} from '@/services/DriverBooking';
import { getErrorMessage } from '@/services/axiosClient';
import { formatCurrency } from '@/utils/formatCurrency';
import { ActiveRideCard } from '@/components/booking/ActiveRideCard';
import { RideDetailsModal } from '@/components/booking/RideDetailsModal';
import { CreateRideModal } from '@/components/booking/CreateRideModal';
import { useRideSocket } from '@/hooks/useRideSocket';
import { useSocket } from '@/context/SocketContext';
import { useDriverLocationTracker } from '@/hooks/useDriverLocationTracker';
import Swal from 'sweetalert2';

export function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return localStorage.getItem('driver_is_online') === 'true';
  });
  const [dutyLoading, setDutyLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [selectedRideData, setSelectedRideData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Socket management hook
  const { reconnect } = useSocket();
  const {
    isConnected: isSocketConnected,
    connectionError: socketError,
    activeRide,
    setActiveRide,
    pendingRequests,
    setPendingRequests,
    nextAction,
    emitLocation,
  } = useRideSocket({
    onTripCompleted: () => {
      loadDashboardData(true);
    },
    onTripPayment: () => {
      loadDashboardData(true);
    },
  });

  // GPS Location Tracker hook
  const activeRideId = activeRide?.rideId || activeRide?.id || activeRide?._id || null;

  const {
    currentCoords,
    isTracking: isGpsTracking,
    permissionState: gpsPermission,
    locationError: gpsError,
    lastSentMode,
    retryLocation,
  } = useDriverLocationTracker({
    isOnline,
    activeRideId,
    isSocketConnected,
    sendSocketLocation: (payload) => {
      emitLocation(payload);
      return isSocketConnected;
    },
    throttleMs: 3500,
  });

  // Fetch Dashboard and Live Booking Home Data (Initial / periodic load over HTTP)
  const loadDashboardData = useCallback(async (showIndicator = false) => {
    if (showIndicator) setRefreshing(true);
    try {
      // Fetch mock fallback, driver dashboard, live ride home, active ride, and pending requests
      const [mockRes, dashRes, homeRes, activeRes, reqsRes] = await Promise.allSettled([
        api.getDashboardData(),
        getDriverRideDashboard(),
        getDriverRideHome(),
        getActiveRide(),
        getRideRequests(),
      ]);

      const mockData: any = mockRes.status === 'fulfilled' ? mockRes.value : {};
      const dashData: any = dashRes.status === 'fulfilled' ? dashRes.value : null;
      const homeData: any = homeRes.status === 'fulfilled' ? homeRes.value : null;
      const activeData: any = activeRes.status === 'fulfilled' ? activeRes.value : null;
      const reqsData: any = reqsRes.status === 'fulfilled' ? reqsRes.value : [];

      // Merge real ride home & dashboard stats with mock fallbacks
      const homeStats = homeData?.stats;
      const dashToday = dashData?.today;
      const homeDuty = dashData?.duty || homeData?.duty || homeData?.driver;

      const merged = {
        todayEarnings:
          dashToday?.earnings ??
          homeStats?.totalEarned ??
          homeData?.todayEarnings ??
          homeData?.totalEarnings ??
          mockData?.todayEarnings ??
          0,
        trips:
          dashToday?.trips ??
          homeStats?.totalTrips ??
          homeData?.todayTrips ??
          homeData?.totalTrips ??
          mockData?.trips ??
          0,
        onlineHours:
          dashToday?.onlineDurationText ??
          homeData?.onlineHours ??
          mockData?.onlineHours ??
          '0h 0m',
        rating:
          dashToday?.rating ??
          dashData?.rating ??
          homeStats?.rating ??
          homeData?.rating ??
          mockData?.rating ??
          4.9,
        transactions:
          dashToday?.trips ??
          homeStats?.totalTrips ??
          mockData?.transactions ??
          0,
        cashCollected: homeData?.cashCollected ?? 0,
        greeting: dashData?.greeting,
        activeVehicle: dashData?.activeVehicle,
        performance: dashData?.performance,
      };

      setData(merged);

      // Duty status from backend
      if (homeDuty?.isOnline !== undefined) {
        const backendOnline = Boolean(homeDuty.isOnline);
        setIsOnline(backendOnline);
        localStorage.setItem('driver_is_online', String(backendOnline));
      }

      // Active Ride (Populate if present, including dispatcher assigned rides)
      const resolvedActiveRide =
        activeData ||
        dashData?.activeRide ||
        homeData?.activeRide ||
        (Array.isArray(reqsData)
          ? reqsData.find((r: any) => {
              const st = (r?.status || '').toUpperCase();
              return st === 'DRIVER_ASSIGNED' || st === 'ACCEPTED';
            })
          : null);

      if (resolvedActiveRide) {
        setActiveRide(resolvedActiveRide);
      } else {
        // If a ride is completed and waiting for payment collection, preserve it
        setActiveRide((prev) => {
          if (!prev) return null;
          const statusUpper = (prev.status || '').toUpperCase();
          const paymentUpper = (prev.paymentStatus || '').toUpperCase();
          if (
            (statusUpper === 'COMPLETED' || statusUpper === 'RIDE_COMPLETED' || statusUpper === 'PAYMENT_PENDING') &&
            paymentUpper !== 'PAID'
          ) {
            return prev;
          }
          return null;
        });
      }

      // Pending requests (Populate if present, otherwise clear)
      const currentActiveId = resolvedActiveRide
        ? (resolvedActiveRide.rideId || (resolvedActiveRide as any)._id || resolvedActiveRide.id || (resolvedActiveRide as any).tripId || (resolvedActiveRide as any).requestId)
        : null;

      if (Array.isArray(reqsData)) {
        const filtered = reqsData.filter((r: any) => {
          const rId = r.rideId || r._id || r.id || r.tripId || r.requestId;
          if (currentActiveId && rId === currentActiveId) return false;
          const st = (r?.status || '').toUpperCase();
          if (st === 'DRIVER_ASSIGNED' || st === 'ACCEPTED' || st === 'ARRIVED' || st === 'STARTED') return false;
          return true;
        });
        setPendingRequests(filtered);
      } else if (Array.isArray(homeData?.pendingRequests)) {
        setPendingRequests(homeData.pendingRequests);
      } else if (Array.isArray(homeData?.requests)) {
        setPendingRequests(homeData.requests);
      } else {
        setPendingRequests([]);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      if (showIndicator) setRefreshing(false);
    }
  }, [setActiveRide, setPendingRequests]);

  useEffect(() => {
    loadDashboardData();

    // Periodic sync
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadDashboardData]);

  // Handle Duty Toggle (Go Online / Go Offline)
  const handleToggleDuty = async () => {
    const nextStatus = !isOnline;

    // Check if there is an active ongoing trip
    if (!nextStatus && activeRide) {
      const activeStatus = (activeRide.status || '').toUpperCase();
      if (
        activeStatus === 'ACCEPTED' ||
        activeStatus === 'ARRIVED' ||
        activeStatus === 'STARTED' ||
        activeStatus === 'IN_PROGRESS'
      ) {
        const confirmResult = await Swal.fire({
          title: 'Active Trip In Progress',
          text: 'You have an active ride in progress. Switching offline will stop new ride offers, but live GPS tracking will continue until your current trip completes.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#FF5B26',
          confirmButtonText: 'Proceed Offline',
          cancelButtonText: 'Stay Online',
        });
        if (!confirmResult.isConfirmed) return;
      }
    }

    setDutyLoading(true);

    try {
      await updateDriverDuty({
        isOnline: nextStatus,
      });

      setIsOnline(nextStatus);
      localStorage.setItem('driver_is_online', String(nextStatus));

      Swal.fire({
        icon: 'success',
        title: nextStatus ? 'You are now Online!' : 'You are now Offline',
        text: nextStatus
          ? 'You can now receive incoming ride requests in real time and GPS tracking is active.'
          : 'You will not receive any new ride requests while offline.',
        confirmButtonColor: '#FF5B26',
        timer: 2000,
        showConfirmButton: false,
      });

      // Refresh ride home
      loadDashboardData();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Duty Status Update Failed',
        text: getErrorMessage(err),
        confirmButtonColor: '#FF5B26',
      });
    } finally {
      setDutyLoading(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-4 border-primary-100 border-t-primary-500 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Today's Earnings",
      value: formatCurrency(data.todayEarnings),
      change: '+12%',
      description: 'from yesterday',
      icon: DollarSign,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Total Trips',
      value: data.trips,
      description: 'Trips completed today',
      icon: MapPin,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Online Hours',
      value: data.onlineHours,
      description: 'Active driving time',
      icon: Clock,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      label: 'Your Rating',
      value: `${data.rating} ★`,
      description: 'Driver rating score',
      icon: Award,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ];

  const transactions = [
    {
      title: 'Ride - MG Road',
      amount: 320,
      type: 'Cash',
      icon: MapPin,
      time: '10:42 AM',
    },
    {
      title: 'Ride - Koramangala',
      amount: 280,
      type: 'UPI',
      icon: MapPin,
      time: '09:35 AM',
    },
    {
      title: 'Ride - Whitefield',
      amount: 210,
      type: 'Cash',
      icon: MapPin,
      time: '08:50 AM',
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-medium text-primary-500">
              {data?.greeting?.text || 'Welcome back 👋'}
            </span>
            {data?.activeVehicle && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                {data.activeVehicle.displayName || data.activeVehicle.name} {data.activeVehicle.registrationNumber ? `• ${data.activeVehicle.registrationNumber}` : ''}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                isOnline
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                }`}
              />
              {isOnline ? 'Duty Online' : 'Duty Offline'}
            </span>

            {/* GPS Live Tracking Indicator */}
            {isGpsTracking ? (
              <span
                title={`Live GPS tracking active (${lastSentMode === 'socket' ? 'WebSocket' : lastSentMode === 'rest' ? 'REST Fallback' : 'Acquiring coordinates'})`}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                <span>
                  GPS Live {lastSentMode === 'rest' ? '(REST)' : lastSentMode === 'socket' ? '(Socket)' : ''}
                </span>
                {currentCoords && (
                  <span className="text-[10px] font-mono text-blue-500 hidden md:inline">
                    [{currentCoords.latitude.toFixed(4)}, {currentCoords.longitude.toFixed(4)}]
                  </span>
                )}
              </span>
            ) : isOnline ? (
              <span
                title="GPS is initializing"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>GPS Initializing...</span>
              </span>
            ) : null}

            {/* Socket Live Connection Indicator */}
            {isSocketConnected ? (
              <span
                title="Real-time ride socket is connected"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60"
              >
                <Zap className="w-3 h-3 text-emerald-500 animate-bounce" />
                <span>Socket Live</span>
              </span>
            ) : (
              <button
                onClick={() => reconnect()}
                title={socketError || 'Click to reconnect socket'}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                <WifiOff className="w-3 h-3 text-amber-600" />
                <span>Reconnect Socket</span>
              </button>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">
            Dashboard
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Real-time driver bookings, ride requests and activity status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Refresh Action */}
          <button
            onClick={() => loadDashboardData(true)}
            disabled={refreshing}
            title="Refresh Live Bookings"
            className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#FF5B26]' : ''}`}
            />
          </button>

          {/* Test / Create Ride Request button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4 text-[#FF5B26]" />
            <span>Create Test Ride</span>
          </button>

          {/* Go Online / Go Offline Duty Button */}
          <button
            onClick={handleToggleDuty}
            disabled={dutyLoading}
            className={`
              group inline-flex items-center justify-center gap-2
              px-5 py-2.5 rounded-xl font-semibold text-sm
              transition-all duration-200
              shadow-sm hover:shadow-md
              ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-[#FF5B26] hover:bg-[#E04815] text-white shadow-orange-500/20'
              }
              ${dutyLoading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {dutyLoading ? (
              <div
                className={`w-3.5 h-3.5 border-2 rounded-full animate-spin ${
                  isOnline
                    ? 'border-emerald-600 border-t-transparent'
                    : 'border-white border-t-transparent'
                }`}
              />
            ) : (
              <span
                className={`
                  w-2.5 h-2.5 rounded-full
                  ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-white'}
                `}
              />
            )}

            {isOnline ? 'You’re Online' : 'Go Online'}
          </button>
        </div>
      </div>

      {/* GPS Permission Warning Banner */}
      {isOnline && (gpsPermission === 'denied' || gpsError) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                GPS Location Access Notice
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                {gpsError || 'Browser location permission is required to stream real-time driver coordinates to passengers and dispatchers.'}
              </p>
            </div>
          </div>
          <button
            onClick={retryLocation}
            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors shrink-0 self-start sm:self-center"
          >
            Enable Location Access
          </button>
        </div>
      )}

      {/* Live Booking & Active Ride Management Section */}
      <ActiveRideCard
        ride={activeRide}
        pendingRequests={pendingRequests}
        nextAction={nextAction}
        onRefresh={() => loadDashboardData(true)}
        onRemovePendingRequest={(reqId) => {
          setPendingRequests((prev) =>
            prev.filter((r: any) => {
              const rId = r.rideId || r._id || r.id || r.tripId || r.requestId;
              return rId !== reqId;
            })
          );
        }}
        onViewDetails={(id, rideData) => {
          setSelectedRideId(id);
          setSelectedRideData(
            rideData ||
            pendingRequests.find((r) => (r.rideId || (r as any)._id || (r as any).id) === id) ||
            (activeRide?.rideId === id || (activeRide as any)?._id === id || activeRide?.id === id ? activeRide : null)
          );
        }}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(
          ({
            label,
            value,
            change,
            description,
            icon: Icon,
            iconBg,
            iconColor,
          }) => (
            <div
              key={label}
              className="
                group relative overflow-hidden
                bg-white rounded-2xl
                border border-gray-100
                p-5
                shadow-[0_4px_20px_rgba(0,0,0,0.04)]
                hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                hover:-translate-y-0.5
                transition-all duration-300
              "
            >
              {/* Decorative background */}
              <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gray-50 group-hover:scale-125 transition-transform duration-500" />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div
                    className={`
                      w-11 h-11 rounded-xl
                      ${iconBg}
                      flex items-center justify-center
                      ${iconColor}
                    `}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2.2} />
                  </div>

                  {change && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                      <ArrowUpRight className="w-3 h-3" />
                      {change}
                    </span>
                  )}
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-gray-500">
                    {label}
                  </p>

                  <p className="text-2xl font-bold text-navy mt-1 tracking-tight">
                    {value}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Today Summary */}
        <div
          className="
            xl:col-span-2
            bg-white rounded-2xl
            border border-gray-100
            shadow-[0_4px_20px_rgba(0,0,0,0.04)]
            overflow-hidden
          "
        >
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">
                Today Summary
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Your activity overview
              </p>
            </div>

            <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
              <CircleDollarSign className="w-5 h-5 text-orange-500" />
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* Total Earnings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Total Earnings
                  </p>
                  <p className="text-xs text-gray-400">
                    Today's revenue
                  </p>
                </div>
              </div>

              <span className="font-bold text-gray-900">
                {formatCurrency(data.todayEarnings || 0)}
              </span>
            </div>

            {/* Cash Collected */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Cash Collected
                  </p>
                  <p className="text-xs text-gray-400">
                    Direct payments
                  </p>
                </div>
              </div>

              <span className="font-bold text-gray-900">
                {formatCurrency(data.cashCollected || 0)}
              </span>
            </div>

            {/* Online Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Timer className="w-4 h-4 text-orange-600" />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Online Time
                  </p>
                  <p className="text-xs text-gray-400">
                    Active duty time
                  </p>
                </div>
              </div>

              <span className="font-bold text-gray-900">
                {data.onlineHours || '0h 0m'}
              </span>
            </div>

            {/* Trips */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Completed Trips
                  </p>
                  <p className="text-xs text-gray-400">
                    Successfully completed
                  </p>
                </div>
              </div>

              <span className="font-bold text-gray-900">
                {data.trips || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div
          className="
            xl:col-span-3
            bg-white rounded-2xl
            border border-gray-100
            shadow-[0_4px_20px_rgba(0,0,0,0.04)]
            overflow-hidden
          "
        >
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">
                Recent Activity
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                Your latest rides and trips
              </p>
            </div>

            <Link
              to="/trips"
              className="
                inline-flex items-center gap-1
                text-sm font-semibold
                text-primary-500
                hover:text-primary-600
                transition-colors
              "
            >
              View Trips
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-gray-50">
            {transactions.map((transaction) => {
              const Icon = transaction.icon;

              return (
                <div
                  key={transaction.title}
                  className="
                    p-4 sm:p-5
                    flex items-center gap-3
                    hover:bg-gray-50/70
                    transition-colors
                  "
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {transaction.title}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">
                        {transaction.time}
                      </span>

                      <span className="w-1 h-1 rounded-full bg-gray-300" />

                      <span
                        className="
                          text-[10px] font-semibold
                          px-2 py-0.5 rounded-md
                          bg-gray-100 text-gray-500
                        "
                      >
                        {transaction.type}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">
                      +{formatCurrency(transaction.amount)}
                    </p>

                    <p className="text-[10px] text-emerald-500 font-medium mt-0.5">
                      Completed
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ride Details Modal */}
      <RideDetailsModal
        rideId={selectedRideId}
        initialData={selectedRideData}
        isOpen={Boolean(selectedRideId)}
        onClose={() => {
          setSelectedRideId(null);
          setSelectedRideData(null);
        }}
      />

      {/* Create Ride Modal for Testing */}
      <CreateRideModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => loadDashboardData(true)}
      />
    </div>
  );
}