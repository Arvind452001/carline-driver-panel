import { useState } from 'react';
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
} from 'lucide-react';
import {
  acceptRideRequest,
  markDriverArrived,
  startRide,
  completeRide,
  collectRidePayment,
  cancelRide,
  getRideRequestById,
} from '@/services/DriverBooking';
import { getErrorMessage } from '@/services/axiosClient';
import { formatCurrency } from '@/utils/formatCurrency';
import Swal from 'sweetalert2';

interface ActiveRideCardProps {
  ride: any;
  pendingRequests?: any[];
  onRefresh: () => void;
  onViewDetails: (rideId: string) => void;
}

export function ActiveRideCard({
  ride,
  pendingRequests = [],
  onRefresh,
  onViewDetails,
}: ActiveRideCardProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Helper to extract ride ID
  const getRideId = (r: any) => r?.rideId || r?._id || r?.id;

  // 1. Accept Ride Request
  const handleAcceptRequest = async (request: any) => {
    const id = getRideId(request);
    setActionLoading(`accept-${id}`);
    try {
      await acceptRideRequest({
        rideRequestId: id,
        rideId: id,
        id,
      });
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

  // 2. Mark Arrived
  const handleMarkArrived = async (rideToUpdate: any) => {
    const id = getRideId(rideToUpdate);
    setActionLoading('arrived');
    try {
      await markDriverArrived({
        rideId: id,
        id,
      });
      Swal.fire({
        icon: 'success',
        title: 'Arrived at Pickup!',
        text: 'The passenger has been notified of your arrival.',
        confirmButtonColor: '#FF5B26',
        timer: 2000,
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
      text: 'Ask the passenger for their 4-digit ride OTP (optional if not provided):',
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
      await startRide({
        rideId: id,
        id,
        otp: otp ? otp.trim() : undefined,
      });
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
        id,
        actualDistance: rideToUpdate.distance || rideToUpdate.actualDistance || 0,
        fare: rideToUpdate.fare || rideToUpdate.amount || 0,
      });
      Swal.fire({
        icon: 'success',
        title: 'Ride Completed!',
        text: 'Please collect payment from the passenger.',
        confirmButtonColor: '#FF5B26',
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

  // 5. Collect Payment
  const handleCollectPayment = async (rideToUpdate: any) => {
    const id = getRideId(rideToUpdate);
    const fareAmount =
      rideToUpdate.fare || rideToUpdate.amount || rideToUpdate.totalAmount || 0;

    const { value: paymentForm, isConfirmed } = await Swal.fire({
      title: 'Collect Ride Payment',
      html: `
        <div class="text-left space-y-3 py-2 text-sm text-gray-700">
          <div>
            <label class="block font-semibold mb-1">Amount to Collect:</label>
            <input id="swal-amount" class="w-full px-3 py-2 border rounded-lg" type="number" value="${fareAmount}" />
          </div>
          <div>
            <label class="block font-semibold mb-1">Payment Method:</label>
            <select id="swal-mode" class="w-full px-3 py-2 border rounded-lg bg-white">
              <option value="CASH">Cash</option>
              <option value="UPI">UPI / QR Code</option>
              <option value="ONLINE">Online Wallet / Card</option>
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
        id,
        amount: paymentForm.amount,
        totalAmount: paymentForm.amount,
        paymentMode: paymentForm.mode,
        isCollected: true,
      });
      Swal.fire({
        icon: 'success',
        title: 'Payment Received!',
        text: `Collected ${formatCurrency(paymentForm.amount)} via ${paymentForm.mode}.`,
        confirmButtonColor: '#FF5B26',
      });
      onRefresh();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Payment Record Failed',
        text: getErrorMessage(err),
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
        id,
        reason,
        cancelledBy: 'DRIVER',
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
  const handleInspectRequest = async (request: any) => {
    const id = getRideId(request);
    try {
      const data = await getRideRequestById(id);
      if (data) {
        onViewDetails(id);
      }
    } catch (err) {
      onViewDetails(id);
    }
  };

  // Render pending ride requests banner
  const hasPending = pendingRequests && pendingRequests.length > 0;

  return (
    <div className="space-y-4">
      {/* Pending Incoming Ride Requests */}
      {hasPending && (
        <div className="space-y-3">
          {pendingRequests.map((req) => {
            const reqId = getRideId(req);
            const pPickup =
              typeof req.pickup === 'string'
                ? req.pickup
                : req.pickup?.address || req.pickupAddress || 'Pickup address';
            const pDrop =
              typeof req.drop === 'string'
                ? req.drop
                : req.drop?.address || req.dropAddress || 'Drop address';
            const fare = req.estimatedFare || req.fare || req.amount || 0;

            return (
              <div
                key={reqId}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-[#FF5B26] p-5 text-white shadow-xl shadow-orange-500/20 border border-orange-400/40 animate-pulse"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                      <BellRing className="w-5 h-5 text-white animate-bounce" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-bold tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                          Incoming Ride Request
                        </span>
                        <span className="text-xs font-mono opacity-80">#{reqId?.slice(-6)}</span>
                      </div>
                      <p className="text-base font-bold mt-1">
                        {req.passenger?.name || req.passengerName || 'New Passenger'}
                      </p>
                      <div className="flex items-center gap-4 text-xs opacity-90 mt-1">
                        <span>Distance: {req.distance || 0} km</span>
                        <span>•</span>
                        <span className="font-bold text-sm">{formatCurrency(fare)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleInspectRequest(req)}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur-sm transition-colors"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => handleCancelRide(req)}
                      className="px-3 py-2 rounded-xl bg-black/20 hover:bg-black/30 text-xs font-semibold backdrop-blur-sm transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(req)}
                      disabled={actionLoading === `accept-${reqId}`}
                      className="px-5 py-2 rounded-xl bg-white text-[#FF5B26] hover:bg-orange-50 text-xs font-bold shadow-md transition-all duration-150 flex items-center gap-1.5"
                    >
                      {actionLoading === `accept-${reqId}` ? (
                        <div className="w-3.5 h-3.5 border-2 border-[#FF5B26] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      Accept Ride
                    </button>
                  </div>
                </div>

                {/* Pickup / Drop Snippet */}
                <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 truncate opacity-90">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-300" />
                    <span className="truncate">{pPickup}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate opacity-90">
                    <Navigation className="w-3.5 h-3.5 shrink-0 text-rose-300" />
                    <span className="truncate">{pDrop}</span>
                  </div>
                </div>
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
                onClick={() => onViewDetails(getRideId(ride))}
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
                  {(ride.passenger?.name || ride.passengerName || 'P').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Passenger</p>
                  <p className="text-sm font-bold text-gray-900">
                    {ride.passenger?.name || ride.passengerName || 'Passenger'}
                  </p>
                </div>
              </div>
              {(ride.passenger?.phone || ride.phoneNumber) && (
                <a
                  href={`tel:${ride.passenger?.phone || ride.phoneNumber}`}
                  className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Estimated Fare */}
            <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Trip Fare</p>
                <p className="text-sm font-bold text-gray-900">
                  {formatCurrency(ride.fare || ride.estimatedFare || ride.amount || 0)}
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
                  {ride.distance || ride.actualDistance || 0} km
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
                <span className="font-semibold text-gray-500">Drop: </span>
                <span className="text-gray-800">
                  {typeof ride.drop === 'string'
                    ? ride.drop
                    : ride.drop?.address || ride.dropAddress || 'Drop address'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Step Bar based on current status */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-gray-500">
              Current Step:{' '}
              <span className="font-semibold text-gray-800">
                {ride.status === 'ACCEPTED' && 'Driver moving to pickup'}
                {ride.status === 'ARRIVED' && 'Driver arrived at pickup location'}
                {(ride.status === 'STARTED' || ride.status === 'IN_PROGRESS') &&
                  'Trip currently in progress'}
                {(ride.status === 'COMPLETED' || ride.status === 'PAYMENT_PENDING') &&
                  'Trip completed, collect payment'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* If Accepted -> Mark Arrived */}
              {(!ride.status || ride.status === 'ACCEPTED') && (
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

              {/* If Arrived -> Start Ride */}
              {ride.status === 'ARRIVED' && (
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

              {/* If Started -> Complete Ride */}
              {(ride.status === 'STARTED' || ride.status === 'IN_PROGRESS') && (
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

              {/* If Completed / Payment Pending -> Collect Payment */}
              {(ride.status === 'COMPLETED' || ride.status === 'PAYMENT_PENDING') && (
                <button
                  onClick={() => handleCollectPayment(ride)}
                  disabled={actionLoading === 'payment'}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
                >
                  {actionLoading === 'payment' && (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <CreditCard className="w-4 h-4" />
                  Collect Payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
