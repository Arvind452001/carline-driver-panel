import { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  CheckCircle2,
  DollarSign,
  Eye,
  Key,
  CreditCard,
  XCircle,
  BellRing,
  Clock,
  Hourglass,
  RefreshCw,
  Info,
  Flag,
  MessageSquare,
} from 'lucide-react';
import {
  acceptRideRequest,
  rejectRideRequest,
  markDriverArrived,
  getRideWaitingTime,
  startRide,
  markDestinationReached,
  completeRide,
  getFinalFare,
  collectRidePayment,
  cancelRide,
} from '@/services/DriverBooking';
import { getErrorMessage } from '@/services/axiosClient';
import { formatCurrency } from '@/utils/formatCurrency';
import Swal from 'sweetalert2';
import type { NextActionType } from '@/types/socket';
import type { WaitingStatusResponse, FinalFareResponse } from '@/types/booking';
import { RideChatModal } from '@/components/chat/RideChatModal';
import { useRideChat } from '@/hooks/useRideChat';

interface ActiveRideCardProps {
  ride: any;
  pendingRequests?: any[];
  nextAction?: NextActionType;
  onRefresh: () => void;
  onViewDetails: (rideId: string, data?: any) => void;
  onRemovePendingRequest?: (rideId: string) => void;
}

export function ActiveRideCard({
  ride,
  pendingRequests = [],
  nextAction,
  onRefresh,
  onViewDetails,
  onRemovePendingRequest,
}: ActiveRideCardProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // In-Ride Chat modal state
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Waiting time tracking and delay fare calculation state
  const [waitingData, setWaitingData] = useState<WaitingStatusResponse | null>(null);
  const [elapsedWaitingSeconds, setElapsedWaitingSeconds] = useState<number>(0);
  const [isSyncingWaiting, setIsSyncingWaiting] = useState(false);
  const arrivalTimestampRef = useRef<number | null>(null);

  // Helper to extract ride ID
  const getRideId = (r: any) =>
    r?.rideId || r?._id || r?.id || r?.tripId || r?.requestId || r?.bookingId || '';

  const rawStatus = (ride?.status || '').toUpperCase();
  const isWaitingStatus = rawStatus === 'ARRIVED' || rawStatus === 'DRIVER_ARRIVED';
  const currentRideId = getRideId(ride);

  // In-Ride Chat hook integration
  const {
    messages: chatMessages,
    unreadCount: unreadChatCount,
    isPassengerTyping: isChatPassengerTyping,
    loading: chatLoading,
    sending: chatSending,
    sendMessage: handleSendChatMessage,
    sendTyping: handleSendChatTyping,
    markAsRead: handleMarkChatAsRead,
  } = useRideChat({
    rideId: currentRideId || null,
    isOpen: isChatOpen,
    onNewIncomingMessage: (incoming) => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: `Message from ${incoming.senderName || 'Customer'}`,
        text: incoming.message,
        showConfirmButton: true,
        confirmButtonText: 'Reply',
        confirmButtonColor: '#FF5B26',
        timer: 6000,
      }).then((res) => {
        if (res.isConfirmed) {
          setIsChatOpen(true);
        }
      });
    },
  });

  // Poll waiting status and calculate delay in real-time
  useEffect(() => {
    if (!isWaitingStatus || !currentRideId) {
      setWaitingData(null);
      setElapsedWaitingSeconds(0);
      arrivalTimestampRef.current = null;
      return;
    }

    // Determine initial arrival time
    const arrivedAtStr = ride?.arrivedAt || ride?.driverArrivedAt;
    const initialArrivalMs = arrivedAtStr ? new Date(arrivedAtStr).getTime() : Date.now();
    if (!arrivalTimestampRef.current) {
      arrivalTimestampRef.current = isNaN(initialArrivalMs) ? Date.now() : initialArrivalMs;
    }

    // Fetch waiting status from backend API
    const fetchWaiting = async () => {
      try {
        setIsSyncingWaiting(true);
        const data = await getRideWaitingTime(currentRideId);
        if (data) {
          setWaitingData(data);
          if (typeof data.waitingSeconds === 'number') {
            setElapsedWaitingSeconds(data.waitingSeconds);
            arrivalTimestampRef.current = Date.now() - data.waitingSeconds * 1000;
          } else if (typeof data.waitingMinutes === 'number') {
            setElapsedWaitingSeconds(Math.round(data.waitingMinutes * 60));
            arrivalTimestampRef.current = Date.now() - Math.round(data.waitingMinutes * 60 * 1000);
          }
        }
      } catch (err) {
        console.warn('[ActiveRideCard] Failed to fetch waiting status:', err);
      } finally {
        setIsSyncingWaiting(false);
      }
    };

    fetchWaiting();

    // 1-second interval to tick timer smoothly
    const timer = setInterval(() => {
      if (arrivalTimestampRef.current) {
        const secs = Math.max(0, Math.floor((Date.now() - arrivalTimestampRef.current) / 1000));
        setElapsedWaitingSeconds(secs);
      }
    }, 1000);

    // Poll backend waiting API every 15s
    const pollInterval = setInterval(() => {
      fetchWaiting();
    }, 15000);

    return () => {
      clearInterval(timer);
      clearInterval(pollInterval);
    };
  }, [isWaitingStatus, currentRideId, ride?.arrivedAt, ride?.driverArrivedAt]);

  // Derived waiting calculations
  const gracePeriodSeconds =
    (typeof waitingData?.gracePeriodSeconds === 'number'
      ? waitingData.gracePeriodSeconds
      : typeof waitingData?.gracePeriodMinutes === 'number'
      ? waitingData.gracePeriodMinutes * 60
      : (ride?.gracePeriodMinutes ?? 3) * 60) || 180;

  const remainingGraceSeconds = Math.max(0, gracePeriodSeconds - elapsedWaitingSeconds);
  const isGraceExpired = elapsedWaitingSeconds > gracePeriodSeconds;
  const delaySeconds = Math.max(0, elapsedWaitingSeconds - gracePeriodSeconds);
  const delayMinutes = Math.ceil(delaySeconds / 60);

  const perMinuteRate =
    waitingData?.perMinuteWaitingRate ??
    waitingData?.ratePerMinute ??
    ride?.waitingRatePerMin ??
    ride?.fare?.perMinuteWaitingRate ??
    ride?.perMinuteWaitingFee ??
    3;

  // Accrued waiting charges from server or calculated live
  const calculatedWaitingCharges =
    waitingData?.accruedWaitingCharges ??
    waitingData?.waitingCharge ??
    waitingData?.waitingCharges ??
    (isGraceExpired ? delayMinutes * perMinuteRate : 0);

  const baseFareAmount =
    ride?.payableFare ??
    ride?.totalFare ??
    (typeof ride?.fare === 'number' ? ride.fare : (ride?.fare?.payableFare ?? ride?.fare?.totalFare)) ??
    ride?.estimatedFare ??
    ride?.amount ??
    0;

  const dynamicTotalFare =
    waitingData?.totalUpdatedFare ??
    (baseFareAmount + calculatedWaitingCharges);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 1. Accept Ride Request
  const handleAcceptRequest = async (request: any) => {
    const id = getRideId(request);
    if (!id) return;
    setActionLoading(`accept-${id}`);
    try {
      try {
        await acceptRideRequest({
          rideId: id,
        });
      } catch (acceptErr: any) {
        const errMsg = getErrorMessage(acceptErr).toLowerCase();
        if (
          errMsg.includes('already assigned') ||
          errMsg.includes('already accepted') ||
          errMsg.includes('driver_assigned') ||
          errMsg.includes('already in progress') ||
          errMsg.includes('not in searching')
        ) {
          console.warn('[ActiveRideCard] Ride already assigned on server:', errMsg);
        } else {
          throw acceptErr;
        }
      }

      // Remove from pending UI list immediately
      onRemovePendingRequest?.(id);

      Swal.fire({
        icon: 'success',
        title: 'Ride Accepted!',
        text: 'Head towards the passenger pickup location.',
        confirmButtonColor: '#FF5B26',
        timer: 2000,
        showConfirmButton: false,
      });
      onRefresh();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Could Not Accept Ride',
        text: getErrorMessage(err),
        confirmButtonColor: '#FF5B26',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // 1b. Reject / Decline Ride Request
  const handleRejectRequest = async (request: any) => {
    const id = getRideId(request);
    if (!id) return;
    setActionLoading(`reject-${id}`);
    try {
      await rejectRideRequest({
        rideId: id,
      });

      // Remove from pending list immediately
      onRemovePendingRequest?.(id);

      Swal.fire({
        icon: 'info',
        title: 'Ride Request Declined',
        text: 'Request transferred to another nearby driver.',
        confirmButtonColor: '#FF5B26',
        timer: 1800,
        showConfirmButton: false,
      });
      onRefresh();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Could Not Decline Ride',
        text: getErrorMessage(err),
        confirmButtonColor: '#FF5B26',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // 2. Mark Arrived (Driver reaches pickup point & begins waiting for passenger)
  const handleMarkArrived = async (rideToUpdate: any) => {
    const id = getRideId(rideToUpdate);
    setActionLoading('arrived');
    try {
      await markDriverArrived({
        rideId: id,
      });

      arrivalTimestampRef.current = Date.now();
      setElapsedWaitingSeconds(0);

      // Trigger instant check of waiting status
      getRideWaitingTime(id).then((w) => {
        if (w) setWaitingData(w);
      });

      Swal.fire({
        icon: 'success',
        title: 'Arrived at Pickup!',
        text: 'The passenger has been notified of your arrival. Waiting timer has started.',
        confirmButtonColor: '#FF5B26',
        timer: 2200,
        showConfirmButton: false,
      });
      onRefresh();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: getErrorMessage(err),
        confirmButtonColor: '#FF5B26',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // 3. Start Ride (with OTP prompt)
  const handleStartRide = async (rideToUpdate: any) => {
    const id = getRideId(rideToUpdate);

    const { value: otp, isConfirmed } = await Swal.fire({
      title: 'Enter Start OTP',
      text: 'Ask the passenger for their 6-digit ride OTP (optional if not provided):',
      input: 'text',
      inputPlaceholder: 'e.g. 1234',
      showCancelButton: true,
      confirmButtonColor: '#FF5B26',
      confirmButtonText: 'Start Trip',
      cancelButtonText: 'Cancel',
      inputAttributes: {
        maxlength: '6',
        autocapitalize: 'off',
        autocorrect: 'off',
      },
    });

    if (!isConfirmed) return;

    setActionLoading('start');
    try {
      const startPayload: { rideId: string; otp?: string } = { rideId: id };
      if (otp && otp.trim()) {
        startPayload.otp = otp.trim();
      }
      await startRide(startPayload);
      Swal.fire({
        icon: 'success',
        title: 'Ride Started!',
        text: 'Drive safely to the destination.',
        confirmButtonColor: '#FF5B26',
        timer: 2000,
        showConfirmButton: false,
      });
      onRefresh();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Start Ride',
        text: getErrorMessage(err),
        confirmButtonColor: '#FF5B26',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // 3b. Mark Destination Reached (calculates final fare and prepares trip completion)
  const handleDestinationReached = async (rideToUpdate: any) => {
    const id = getRideId(rideToUpdate);
    setActionLoading('destination-reached');
    try {
      await markDestinationReached({
        rideId: id,
      });

      let fareText = '';
      try {
        const finalFare = await getFinalFare(id);
        if (finalFare?.payableFare) {
          fareText = ` Final calculated fare: ${formatCurrency(finalFare.payableFare)}.`;
        }
      } catch {
        // ignore
      }

      Swal.fire({
        icon: 'success',
        title: 'Destination Reached!',
        text: `Dropoff location reached.${fareText} Ready for completion.`,
        confirmButtonColor: '#FF5B26',
        timer: 2500,
        showConfirmButton: false,
      });
      onRefresh();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: getErrorMessage(err),
        confirmButtonColor: '#FF5B26',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // 4. Complete Ride
  const handleCompleteRide = async (rideToUpdate: any) => {
    const id = getRideId(rideToUpdate);

    const confirm = await Swal.fire({
      title: 'Complete this Ride?',
      text: 'Have you reached the destination safely?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#FF5B26',
      confirmButtonText: 'Yes, Complete Ride',
      cancelButtonText: 'Not Yet',
    });

    if (!confirm.isConfirmed) return;

    setActionLoading('complete');
    try {
      await completeRide({
        rideId: id,
      });

      if (rideToUpdate) {
        rideToUpdate.status = 'RIDE_COMPLETED';
      }

      Swal.fire({
        icon: 'success',
        title: 'Ride Completed!',
        text: 'Please collect payment from the passenger.',
        confirmButtonColor: '#FF5B26',
        timer: 1800,
        showConfirmButton: false,
      });
      onRefresh();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Complete Ride',
        text: getErrorMessage(err),
        confirmButtonColor: '#FF5B26',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // 5. Collect Payment (Fetches final-fare with waiting charges breakdown)
  const handleCollectPayment = async (rideToUpdate: any) => {
    const id = getRideId(rideToUpdate);

    setActionLoading('payment-prep');
    let finalFareData: FinalFareResponse | null = null;
    try {
      finalFareData = await getFinalFare(id);
    } catch {
      finalFareData = null;
    } finally {
      setActionLoading(null);
    }

    const waitingCharges =
      finalFareData?.waitingCharges ??
      finalFareData?.waitingCharge ??
      rideToUpdate?.waitingCharge ??
      0;

    const fareAmount =
      finalFareData?.payableFare ??
      finalFareData?.totalFare ??
      finalFareData?.total ??
      rideToUpdate.payableFare ??
      rideToUpdate.totalFare ??
      rideToUpdate.fare ??
      rideToUpdate.amount ??
      0;

    const baseFare = fareAmount > waitingCharges ? fareAmount - waitingCharges : fareAmount;

    const waitingSnippet = waitingCharges > 0
      ? `
        <div class="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-1 mb-3 text-left">
          <div class="flex justify-between text-gray-600">
            <span>Base / Trip Fare:</span>
            <span class="font-semibold">${formatCurrency(baseFare)}</span>
          </div>
          <div class="flex justify-between text-amber-800 font-bold">
            <span>Accrued Waiting Delay Charges:</span>
            <span>+${formatCurrency(waitingCharges)}</span>
          </div>
          <div class="border-t border-amber-200 pt-1 flex justify-between font-extrabold text-gray-900">
            <span>Total Payable Fare:</span>
            <span class="text-emerald-600">${formatCurrency(fareAmount)}</span>
          </div>
        </div>
      `
      : '';

    const { value: paymentForm, isConfirmed } = await Swal.fire({
      title: 'Collect Ride Payment',
      html: `
        <div class="text-left space-y-3 py-2 text-sm text-gray-700">
          ${waitingSnippet}
          <div>
            <label class="block font-semibold mb-1">Amount to Collect:</label>
            <input id="swal-amount" class="w-full px-3 py-2 border rounded-lg" type="number" value="${fareAmount}" />
          </div>
          <div>
            <label class="block font-semibold mb-1">Payment Method:</label>
            <select id="swal-mode" class="w-full px-3 py-2 border rounded-lg bg-white">
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="UPI">UPI / QR Code</option>
              <option value="ONLINE">Online Wallet</option>
            </select>
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      confirmButtonText: 'Confirm Payment Received',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const amount = (document.getElementById('swal-amount') as HTMLInputElement)?.value;
        const mode = (document.getElementById('swal-mode') as HTMLSelectElement)?.value;
        return { amount: Number(amount), mode };
      },
    });

    if (!isConfirmed || !paymentForm) return;

    setActionLoading('payment');
    try {
      await collectRidePayment({
        rideId: id,
        paymentMethod: paymentForm.mode,
      });
      await Swal.fire({
        icon: 'success',
        title: 'Payment Received!',
        text: `Collected ${formatCurrency(paymentForm.amount)} via ${paymentForm.mode}.`,
        confirmButtonColor: '#FF5B26',
        timer: 2000,
        showConfirmButton: false,
      });
      onRefresh();
    } catch (err: any) {
      const errMsg = getErrorMessage(err);
      if (
        errMsg.toLowerCase().includes('already complete') ||
        errMsg.toLowerCase().includes('already collected')
      ) {
        onRefresh();
        return;
      }
      Swal.fire({
        icon: 'error',
        title: 'Payment Record Failed',
        text: errMsg,
        confirmButtonColor: '#FF5B26',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // 6. Cancel Ride
  const handleCancelRide = async (rideToUpdate: any) => {
    const id = getRideId(rideToUpdate);

    const { value: reason, isConfirmed } = await Swal.fire({
      title: 'Cancel Ride',
      text: 'Please select or provide a reason for cancellation:',
      input: 'select',
      inputOptions: {
        'Passenger not responding': 'Passenger not responding',
        'Vehicle breakdown / issue': 'Vehicle breakdown / issue',
        'Heavy traffic / Long detour': 'Heavy traffic / Long detour',
        'Passenger requested cancellation': 'Passenger requested cancellation',
        'Other reason': 'Other reason',
      },
      inputPlaceholder: 'Select a reason',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Yes, Cancel Ride',
      cancelButtonText: 'Back',
      inputValidator: (val) => {
        if (!val) return 'Please select a reason!';
      },
    });

    if (!isConfirmed || !reason) return;

    setActionLoading('cancel');
    try {
      await cancelRide({
        rideId: id,
        reason,
      });
      Swal.fire({
        icon: 'info',
        title: 'Ride Cancelled',
        text: 'The ride has been cancelled.',
        confirmButtonColor: '#FF5B26',
      });
      onRefresh();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Cancellation Failed',
        text: getErrorMessage(err),
        confirmButtonColor: '#FF5B26',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Inspect Pending Request
  const handleInspectRequest = (request: any) => {
    const id = getRideId(request);
    onViewDetails(id, request);
  };

  // Render pending ride requests banner (filter out any ride that is currently active or already accepted)
  const currentActiveId = getRideId(ride);
  const activePendingList = (pendingRequests || []).filter((req) => {
    const reqId = getRideId(req);
    if (!reqId) return false;
    if (currentActiveId && reqId === currentActiveId) return false;
    const reqStatus = (req?.status || '').toUpperCase();
    if (
      reqStatus === 'ACCEPTED' ||
      reqStatus === 'DRIVER_ASSIGNED' ||
      reqStatus === 'ARRIVED' ||
      reqStatus === 'STARTED' ||
      reqStatus === 'IN_PROGRESS' ||
      reqStatus === 'COMPLETED'
    ) {
      return false;
    }
    return true;
  });

  const hasPending = activePendingList.length > 0;

  return (
    <div className="space-y-4">
      {/* Pending Incoming Ride Requests */}
      {hasPending && (
        <div className="space-y-3">
          {activePendingList.map((req) => {
            const reqId = getRideId(req);
            const pPickup =
              typeof req.pickup === 'string'
                ? req.pickup
                : req.pickup?.address || (req as any).pickupAddress || 'Pickup address';
            const pDrop =
              typeof (req as any).dropoff === 'string'
                ? (req as any).dropoff
                : (req as any).dropoff?.address ||
                  (typeof (req as any).drop === 'string'
                    ? (req as any).drop
                    : (req as any).drop?.address || (req as any).dropAddress || (req as any).dropoffAddress || 'Dropoff destination');
            const fare =
              (req as any).payableFare ??
              (req as any).totalFare ??
              (typeof req.fare === 'number'
                ? req.fare
                : ((req.fare as any)?.payableFare ?? (req.fare as any)?.totalFare)) ??
              req.estimatedFare ??
              (req as any).amount ??
              0;
            const dist = (req as any).distanceKm ?? req.distance ?? (req as any).distanceMiles ?? 0;
            const duration = (req as any).durationMinutes ?? (req as any).etaMinutes ?? req.estimatedDuration ?? 0;
            const vehicleInfo = (req as any).vehicleType?.name || (req as any).vehicleType?.displayName || '';
            const passengerName =
              req.passenger?.fullName ||
              req.passenger?.name ||
              (req as any).passengerName ||
              ((req as any).passengerCount ? `${(req as any).passengerCount} Passenger${(req as any).passengerCount > 1 ? 's' : ''}` : 'New Passenger');
            const payMethod = (req as any).paymentMethod || req.paymentMethod || 'CASH';

            return (
              <div
                key={reqId}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-[#FF5B26] to-[#E04815] p-5 text-white shadow-xl shadow-orange-500/25 border border-orange-400/40 animate-pulse"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-inner">
                      <BellRing className="w-5 h-5 text-white animate-bounce" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] uppercase font-bold tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full">
                          Incoming Ride Request
                        </span>
                        {vehicleInfo && (
                          <span className="text-[11px] font-semibold bg-black/20 px-2 py-0.5 rounded-full">
                            {vehicleInfo}
                          </span>
                        )}
                        <span className="text-xs font-mono opacity-80">#{reqId?.slice(-6)}</span>
                      </div>

                      <p className="text-base font-bold mt-1 tracking-tight">
                        {passengerName}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-xs opacity-95 mt-1 font-medium">
                        <span>📍 {dist} km</span>
                        {duration > 0 && <span>• ⏱️ ~{duration} mins</span>}
                        <span>• 💳 {payMethod}</span>
                        <span>•</span>
                        <span className="font-extrabold text-sm bg-white/20 px-2 py-0.5 rounded-lg">
                          {formatCurrency(fare)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleInspectRequest(req)}
                      className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-semibold backdrop-blur-sm transition-colors"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => handleRejectRequest(req)}
                      disabled={actionLoading === `reject-${reqId}`}
                      className="px-3.5 py-2 rounded-xl bg-black/25 hover:bg-black/35 text-xs font-semibold backdrop-blur-sm transition-colors"
                    >
                      {actionLoading === `reject-${reqId}` ? 'Declining...' : 'Decline'}
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(req)}
                      disabled={actionLoading === `accept-${reqId}`}
                      className="px-5 py-2.5 rounded-xl bg-white text-[#FF5B26] hover:bg-orange-50 text-xs font-bold shadow-lg transition-all duration-150 flex items-center gap-1.5"
                    >
                      {actionLoading === `accept-${reqId}` ? (
                        <div className="w-3.5 h-3.5 border-2 border-[#FF5B26] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-[#FF5B26]" />
                      )}
                      Accept Ride
                    </button>
                  </div>
                </div>

                {/* Pickup / Drop Snippet */}
                <div className="mt-3.5 pt-3 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-lg">
                    <MapPin className="w-4 h-4 shrink-0 text-emerald-300" />
                    <span className="truncate font-medium">
                      <b className="text-white/80">From:</b> {pPickup}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-lg">
                    <Navigation className="w-4 h-4 shrink-0 text-rose-300" />
                    <span className="truncate font-medium">
                      <b className="text-white/80">To:</b> {pDrop}
                    </span>
                  </div>
                </div>

                {(req as any).notes && (
                  <div className="mt-2 text-[11px] opacity-90 italic">
                    💬 Notes: {(req as any).notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Currently Active Ride Card */}
      {ride && (
        <div className="bg-white rounded-2xl border-2 border-orange-500/30 p-5 sm:p-6 shadow-xl shadow-orange-500/5 relative overflow-hidden">
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF5B26]">
                  Active Ride in Progress
                </span>
                <h3 className="text-lg font-bold text-gray-900">
                  Status: <span className="text-[#FF5B26]">{ride.status || 'ACCEPTED'}</span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsChatOpen(true)}
                className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 text-xs font-bold text-[#FF5B26] transition-colors shadow-2xs"
                title="Chat with Customer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
                {unreadChatCount > 0 && (
                  <span className="min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center animate-bounce shadow-xs">
                    {unreadChatCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => onViewDetails(getRideId(ride), ride)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-gray-500" />
                View Full Details
              </button>
              <button
                onClick={() => handleCancelRide(ride)}
                disabled={actionLoading === 'cancel'}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                Cancel
              </button>
            </div>
          </div>

          {/* Passenger & Trip Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            {/* Passenger Info */}
            <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-[#FF5B26] flex items-center justify-center font-bold text-sm">
                  {(ride.passenger?.fullName || ride.passenger?.name || ride.passengerName || 'P').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Passenger</p>
                  <p className="text-sm font-bold text-gray-900">
                    {ride.passenger?.fullName || ride.passenger?.name || ride.passengerName || (ride.passengerCount ? `${ride.passengerCount} Passengers` : 'Passenger')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="relative w-8 h-8 rounded-full bg-orange-50 text-[#FF5B26] hover:bg-orange-100 flex items-center justify-center transition-colors shadow-2xs"
                  title="Chat with Customer"
                >
                  <MessageSquare className="w-4 h-4" />
                  {unreadChatCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white animate-bounce shadow-xs">
                      {unreadChatCount}
                    </span>
                  )}
                </button>

                {(ride.passenger?.phoneNumber || ride.passenger?.phone || ride.phoneNumber) && (
                  <a
                    href={`tel:${ride.passenger?.phoneNumber || ride.passenger?.phone || ride.phoneNumber}`}
                    className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors shadow-2xs"
                    title="Call Customer"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Estimated Fare */}
            <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Trip Fare</p>
                <p className="text-sm font-bold text-gray-900">
                  {formatCurrency(
                    ride.payableFare ??
                    ride.totalFare ??
                    (typeof ride.fare === 'number' ? ride.fare : (ride.fare?.payableFare ?? ride.fare?.totalFare)) ??
                    ride.estimatedFare ??
                    ride.amount ??
                    0
                  )}
                </p>
              </div>
            </div>

            {/* Distance & Duration */}
            <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Est. Distance</p>
                <p className="text-sm font-bold text-gray-900">
                  {ride.distanceKm ?? ride.distance ?? ride.actualDistance ?? 0} km
                </p>
              </div>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-2 py-2 border-t border-gray-100 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-500">Pickup: </span>
                <span className="text-gray-800">
                  {typeof ride.pickup === 'string'
                    ? ride.pickup
                    : ride.pickup?.address || ride.pickupAddress || 'Pickup address'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Navigation className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-500">Dropoff: </span>
                <span className="text-gray-800">
                  {typeof ride.dropoff === 'string'
                    ? ride.dropoff
                    : ride.dropoff?.address ||
                      (typeof ride.drop === 'string'
                        ? ride.drop
                        : ride.drop?.address || ride.dropAddress || 'Dropoff destination')}
                </span>
              </div>
            </div>
          </div>

          {/* Live Waiting Time & Delay Fare Calculation Box (Customer pickup waiting status & accrued charges) */}
          {isWaitingStatus && (
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/60 to-amber-100/40 border border-orange-200/90 shadow-sm space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-[#FF5B26] flex items-center justify-center shrink-0">
                    <Hourglass className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700">
                      Waiting for Rider at Pickup
                    </span>
                    <h4 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                      <span>Pickup Wait Timer</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-white border border-orange-300 text-[#FF5B26] font-bold shadow-2xs">
                        {formatTimer(elapsedWaitingSeconds)}
                      </span>
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (currentRideId) {
                      setIsSyncingWaiting(true);
                      getRideWaitingTime(currentRideId)
                        .then((d) => d && setWaitingData(d))
                        .finally(() => setIsSyncingWaiting(false));
                    }
                  }}
                  disabled={isSyncingWaiting}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-orange-50 text-xs font-semibold text-gray-700 border border-orange-200 transition-colors shadow-2xs"
                  title="Sync waiting fare with server"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#FF5B26] ${isSyncingWaiting ? 'animate-spin' : ''}`} />
                  <span>Sync Fare</span>
                </button>
              </div>

              {/* Grace Period & Waiting Rate Status Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className={`p-3 rounded-xl border ${
                  !isGraceExpired
                    ? 'bg-emerald-50/90 border-emerald-200/90 text-emerald-900'
                    : 'bg-amber-100/80 border-amber-300/90 text-amber-950'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Free Grace Window:
                    </span>
                    <span>
                      {!isGraceExpired ? (
                        <span className="text-emerald-700 font-extrabold">{formatTimer(remainingGraceSeconds)} free</span>
                      ) : (
                        <span className="text-rose-600 font-extrabold">Expired (+{delayMinutes}m delay)</span>
                      )}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-80 mt-1">
                    {!isGraceExpired
                      ? `Complimentary ${Math.round(gracePeriodSeconds / 60)}-minute boarding period active.`
                      : `Grace window finished. Accruing delay surcharge.`}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-orange-200/80 text-gray-800">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <DollarSign className="w-3.5 h-3.5 text-orange-500" />
                      Delay Surcharge Rate:
                    </span>
                    <span className="text-gray-900 font-extrabold">
                      {formatCurrency(perMinuteRate)}/min
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Added to final fare for each minute of pickup delay.
                  </p>
                </div>
              </div>

              {/* Live Fare Breakdown */}
              <div className="bg-white rounded-xl p-3.5 border border-orange-200 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-[11px] text-gray-400 block font-medium">Estimated Base Fare</span>
                      <span className="font-bold text-gray-800 text-sm">{formatCurrency(baseFareAmount)}</span>
                    </div>
                    <span className="text-gray-300 font-light text-xl">+</span>
                    <div>
                      <span className="text-[11px] text-amber-700 font-bold block">
                        Accrued Waiting Delay {isGraceExpired ? `(${delayMinutes} min)` : '(Grace)'}
                      </span>
                      <span className="font-bold text-amber-700 text-sm">
                        +{formatCurrency(calculatedWaitingCharges)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right pl-4 border-l border-gray-100">
                    <span className="text-[11px] text-gray-400 block uppercase font-bold tracking-wider">
                      Live Total Fare
                    </span>
                    <span className="text-lg font-black text-[#FF5B26]">
                      {formatCurrency(dynamicTotalFare)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>
                  Delay charges are finalized when the trip begins and added to passenger payment at destination.
                </span>
              </div>
            </div>
          )}

          {/* Action Step Bar based on current status & socket nextAction */}
          {(() => {
            const rawStatus = (ride.status || '').toUpperCase();
            const rawPaymentStatus = (ride.paymentStatus || '').toUpperCase();
            const isPaid = rawPaymentStatus === 'PAID' || rawStatus === 'PAID';

            const shouldMarkArrived =
              !isPaid &&
              (nextAction === 'MARK_ARRIVED' ||
              (!nextAction && (rawStatus === 'ACCEPTED' || rawStatus === 'DRIVER_ASSIGNED' || !rawStatus)));
            const shouldStartRide =
              !isPaid &&
              (nextAction === 'START_TRIP' ||
              (!nextAction && (rawStatus === 'ARRIVED' || rawStatus === 'DRIVER_ARRIVED')));
            const shouldDestinationReached =
              !isPaid &&
              (rawStatus === 'STARTED' || rawStatus === 'RIDE_STARTED' || rawStatus === 'IN_PROGRESS');
            const shouldCompleteRide =
              !isPaid &&
              (nextAction === 'END_TRIP' ||
              (!nextAction && (rawStatus === 'STARTED' || rawStatus === 'RIDE_STARTED' || rawStatus === 'IN_PROGRESS' || rawStatus === 'DESTINATION_REACHED')));
            const shouldCollectPayment =
              !isPaid &&
              (nextAction === 'COLLECT_PAYMENT' ||
              rawStatus === 'COMPLETED' ||
              rawStatus === 'RIDE_COMPLETED' ||
              rawStatus === 'PAYMENT_PENDING');

            let stepLabel = 'Ride in progress';
            if (isPaid) stepLabel = 'Payment completed';
            else if (shouldMarkArrived) stepLabel = 'Driver moving to pickup';
            else if (shouldStartRide) stepLabel = 'Driver arrived at pickup (waiting)';
            else if (rawStatus === 'DESTINATION_REACHED') stepLabel = 'Dropoff destination reached';
            else if (shouldCompleteRide) stepLabel = 'Trip currently in progress';
            else if (shouldCollectPayment) stepLabel = 'Trip completed, collect payment';

            return (
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-gray-500">
                  Current Step:{' '}
                  <span className="font-semibold text-gray-800">{stepLabel}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* 1. Mark Arrived */}
                  {shouldMarkArrived && (
                    <button
                      onClick={() => handleMarkArrived(ride)}
                      disabled={actionLoading === 'arrived'}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                    >
                      {actionLoading === 'arrived' && (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      <MapPin className="w-4 h-4" />
                      Driver Arrived
                    </button>
                  )}

                  {/* 2. Start Ride */}
                  {shouldStartRide && (
                    <button
                      onClick={() => handleStartRide(ride)}
                      disabled={actionLoading === 'start'}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
                    >
                      {actionLoading === 'start' && (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      <Key className="w-4 h-4" />
                      Start Ride (with OTP)
                    </button>
                  )}

                  {/* 3a. Reached Destination */}
                  {shouldDestinationReached && (
                    <button
                      onClick={() => handleDestinationReached(ride)}
                      disabled={actionLoading === 'destination-reached'}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
                    >
                      {actionLoading === 'destination-reached' && (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      <Flag className="w-4 h-4" />
                      Reached Destination
                    </button>
                  )}

                  {/* 3b. Complete Ride */}
                  {shouldCompleteRide && (
                    <button
                      onClick={() => handleCompleteRide(ride)}
                      disabled={actionLoading === 'complete'}
                      className="px-5 py-2.5 rounded-xl bg-[#FF5B26] hover:bg-[#e04815] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
                    >
                      {actionLoading === 'complete' && (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      <CheckCircle2 className="w-4 h-4" />
                      Complete Ride
                    </button>
                  )}

                  {/* 4. Collect Payment */}
                  {shouldCollectPayment && (
                    <button
                      onClick={() => handleCollectPayment(ride)}
                      disabled={actionLoading === 'payment' || actionLoading === 'payment-prep'}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
                    >
                      {(actionLoading === 'payment' || actionLoading === 'payment-prep') && (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      <CreditCard className="w-4 h-4" />
                      Collect Payment
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* In-Ride Chat Modal */}
      {ride && (
        <RideChatModal
          rideId={currentRideId || null}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          passengerName={
            ride?.passenger?.fullName ||
            ride?.passenger?.name ||
            ride?.passengerName ||
            'Customer'
          }
          passengerPhone={
            ride?.passenger?.phoneNumber ||
            ride?.passenger?.phone ||
            ride?.phoneNumber
          }
          passengerAvatar={ride?.passenger?.avatar}
          messages={chatMessages}
          isPassengerTyping={isChatPassengerTyping}
          loading={chatLoading}
          sending={chatSending}
          sendMessage={handleSendChatMessage}
          sendTyping={handleSendChatTyping}
          markAsRead={handleMarkChatAsRead}
        />
      )}
    </div>
  );
}
