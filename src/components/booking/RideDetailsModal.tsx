import { useEffect, useState } from 'react';
import {
  X,
  Clock,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Navigation,
  Phone,
  Car,
  FileText,
  Tag,
  Users,
  Milestone,
  MessageSquare,
} from 'lucide-react';
import {
  getRideById,
  getRideRequestById,
  getFinalFare,
  getRideWaitingTime,
  getRideTimeline,
} from '@/services/DriverBooking';
import { getErrorMessage } from '@/services/axiosClient';
import { formatDateTime } from '@/utils/formatDate';
import type { FinalFareResponse, WaitingStatusResponse, TripTimelineItem } from '@/types/booking';
import { RideChatModal } from '@/components/chat/RideChatModal';

interface RideDetailsModalProps {
  rideId: string | null;
  initialData?: any;
  isOpen: boolean;
  onClose: () => void;
}

export function RideDetailsModal({
  rideId,
  initialData,
  isOpen,
  onClose,
}: RideDetailsModalProps) {
  const [ride, setRide] = useState<any>(initialData || null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [finalFare, setFinalFare] = useState<FinalFareResponse | null>(null);
  const [waitingInfo, setWaitingInfo] = useState<WaitingStatusResponse | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TripTimelineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      let data = null;

      // 1. Try ride details endpoint (for assigned/active/completed rides)
      try {
        data = await getRideById(id);
      } catch {
        data = null;
      }

      // 2. Try request details endpoint (for pending requests)
      if (!data) {
        try {
          data = await getRideRequestById(id);
        } catch {
          data = null;
        }
      }

      // 3. Fallback to initialData if available
      if (!data && initialData) {
        data = initialData;
      }

      // 4. Fetch detailed final fare, waiting charges, and timeline in parallel
      const [finalFareRes, waitingRes, timelineRes] = await Promise.allSettled([
        getFinalFare(id),
        getRideWaitingTime(id),
        getRideTimeline(id),
      ]);

      if (finalFareRes.status === 'fulfilled' && finalFareRes.value) {
        setFinalFare(finalFareRes.value);
      } else {
        setFinalFare(null);
      }

      if (waitingRes.status === 'fulfilled' && waitingRes.value) {
        setWaitingInfo(waitingRes.value);
      } else {
        setWaitingInfo(null);
      }

      if (timelineRes.status === 'fulfilled' && Array.isArray(timelineRes.value)) {
        setTimelineEvents(timelineRes.value);
      } else {
        setTimelineEvents([]);
      }

      if (!data) {
        throw new Error('Unable to retrieve ride details.');
      }

      // Merge initialData with fetched data so no fields are lost
      setRide(initialData ? { ...initialData, ...data } : data);
    } catch (err) {
      if (initialData) {
        setRide(initialData);
        setError(null);
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && rideId) {
      if (initialData) {
        setRide(initialData);
      }
      fetchDetails(rideId);
    } else {
      setRide(null);
      setFinalFare(null);
      setWaitingInfo(null);
      setTimelineEvents([]);
      setError(null);
    }
  }, [isOpen, rideId, initialData]);

  if (!isOpen) return null;

  const currency = ride?.fare?.currency || ride?.currency || 'USD';
  const formatMoney = (val: number | undefined | null) => {
    if (val === undefined || val === null || isNaN(Number(val))) return `$0.00`;
    const num = Number(val);
    try {
      return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
      }).format(num);
    } catch {
      return `${currency === 'INR' ? '₹' : '$'}${num.toFixed(2)}`;
    }
  };

  const getStatusColor = (status: string = '') => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'RIDE_COMPLETED':
      case 'PAID':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ACCEPTED':
      case 'DRIVER_ASSIGNED':
      case 'ARRIVED':
      case 'DRIVER_ARRIVED':
      case 'STARTED':
      case 'RIDE_STARTED':
      case 'IN_PROGRESS':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CANCELLED':
      case 'RIDE_CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const formatStatusText = (status: string = '') => {
    if (!status) return 'Completed';
    return status.replace(/_/g, ' ');
  };

  const pickupAddr =
    (typeof ride?.pickup === 'string' ? ride.pickup : null) ||
    ride?.pickup?.address ||
    ride?.pickupAddress ||
    ride?.pickupLocation ||
    'Pickup location not specified';

  const dropAddr =
    (typeof ride?.dropoff === 'string' ? ride.dropoff : null) ||
    ride?.dropoff?.address ||
    (typeof ride?.drop === 'string' ? ride.drop : null) ||
    ride?.drop?.address ||
    ride?.dropAddress ||
    ride?.dropoffAddress ||
    ride?.dropLocation ||
    'Dropoff destination not specified';

  const passengerName =
    ride?.passenger?.fullName ||
    (ride?.passenger?.firstName
      ? `${ride.passenger.firstName} ${ride.passenger.lastName || ''}`.trim()
      : '') ||
    ride?.passenger?.name ||
    ride?.user?.name ||
    ride?.passengerName ||
    ride?.userName ||
    'Passenger';

  const passengerPhone =
    ride?.passenger?.phoneNumber ||
    ride?.passenger?.phone ||
    ride?.user?.phone ||
    ride?.phoneNumber ||
    '';

  const waitingCharges =
    finalFare?.waitingCharges ??
    finalFare?.waitingCharge ??
    waitingInfo?.accruedWaitingCharges ??
    waitingInfo?.waitingCharge ??
    ride?.fare?.waitingCharge ??
    ride?.fareBreakdown?.waitingCharge ??
    ride?.waitingCharge ??
    0;

  const waitingMinutes =
    finalFare?.waitingMinutes ??
    waitingInfo?.waitingMinutes ??
    (waitingInfo?.waitingSeconds ? Math.ceil(waitingInfo.waitingSeconds / 60) : null) ??
    ride?.waitingMinutes ??
    null;

  const fareTotal =
    finalFare?.payableFare ??
    finalFare?.totalFare ??
    finalFare?.total ??
    ride?.payableFare ??
    ride?.totalFare ??
    (typeof ride?.fare === 'number'
      ? ride.fare
      : (ride?.fare?.payableFare ?? ride?.fare?.totalFare)) ??
    ride?.fareBreakdown?.total ??
    ride?.estimatedFare ??
    ride?.totalAmount ??
    ride?.amount ??
    0;

  const tripDistanceKm =
    ride?.distanceKm ??
    ride?.distance ??
    ride?.actualDistance ??
    ride?.fare?.distanceKm ??
    0;

  const tripDistanceMiles =
    ride?.distanceMiles ??
    ride?.fare?.distanceMiles ??
    null;

  const tripDuration =
    ride?.durationMinutes ??
    ride?.duration ??
    ride?.etaMinutes ??
    ride?.fare?.durationMinutes ??
    null;

  const vehicleName =
    ride?.vehicleType?.name ||
    ride?.vehicleType?.displayName ||
    '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">Trip Details</h3>
              {ride?.status && (
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusColor(
                    ride.status
                  )}`}
                >
                  {formatStatusText(ride.status)}
                </span>
              )}
              {ride?.rideType && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                  {ride.rideType}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Ride ID: <span className="font-mono font-medium text-gray-700">{rideId || ride?.rideId || ride?._id}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {loading && !ride && (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-orange-200 border-t-[#FF5B26] rounded-full animate-spin" />
              <p className="text-sm font-medium text-gray-500">Fetching trip details...</p>
            </div>
          )}

          {error && !ride && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-sm font-semibold">Failed to load trip</span>
              </div>
              <p className="text-xs text-red-600">{error}</p>
              {rideId && (
                <button
                  onClick={() => fetchDetails(rideId)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry
                </button>
              )}
            </div>
          )}

          {ride && (
            <>
              {/* Route Path */}
              <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Route & Key Metrics</h4>
                  {ride?.routeSource && (
                    <span className="text-[10px] text-gray-400 font-medium">
                      via {ride.routeSource.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>

                <div className="space-y-3.5 relative pl-6 before:absolute before:left-2.5 before:top-3.5 before:bottom-3.5 before:w-0.5 before:bg-gray-200">
                  <div className="relative">
                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                    <p className="text-xs text-gray-400 font-medium">Pickup</p>
                    <p className="text-sm font-semibold text-gray-800 leading-snug">{pickupAddr}</p>
                  </div>

                  <div className="relative pt-1">
                    <div className="absolute -left-6 top-2 w-3.5 h-3.5 rounded-full bg-rose-500 ring-4 ring-rose-100" />
                    <p className="text-xs text-gray-400 font-medium">Dropoff</p>
                    <p className="text-sm font-semibold text-gray-800 leading-snug">{dropAddr}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-gray-200/70 text-center">
                  <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-[11px] text-gray-400">Distance</p>
                    <p className="text-sm font-bold text-gray-800">
                      {tripDistanceKm} km
                    </p>
                    {tripDistanceMiles && (
                      <p className="text-[10px] text-gray-400">({tripDistanceMiles} mi)</p>
                    )}
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-[11px] text-gray-400">Duration</p>
                    <p className="text-sm font-bold text-gray-800">
                      {tripDuration ? `${tripDuration} mins` : '-'}
                    </p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-[11px] text-gray-400">Total Fare</p>
                    <p className="text-sm font-bold text-emerald-600">
                      {formatMoney(fareTotal)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle & Passenger Count */}
              {(vehicleName || ride.passengerCount) && (
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5B26] flex items-center justify-center">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">Vehicle & Capacity</p>
                      <p className="text-sm font-bold text-gray-900">{vehicleName || 'Standard'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {ride.passengerCount && (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                        <Users className="w-3 h-3" />
                        {ride.passengerCount} {ride.passengerCount > 1 ? 'Passengers' : 'Passenger'}
                      </span>
                    )}
                    {ride.vehicleType?.seats && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-orange-50 text-[#FF5B26] font-semibold border border-orange-100">
                        {ride.vehicleType.seats} Seats
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Passenger Info */}
              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Passenger Details
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-orange-100 text-[#FF5B26] flex items-center justify-center font-bold text-base">
                      {passengerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{passengerName}</p>
                      <p className="text-xs text-gray-500">{passengerPhone || 'No contact provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-[#FF5B26] hover:bg-orange-100 text-xs font-semibold border border-orange-200 transition-colors shadow-2xs"
                      title="Chat with Customer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Chat
                    </button>
                    {passengerPhone && (
                      <a
                        href={`tel:${passengerPhone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 transition-colors shadow-2xs"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes (if provided by passenger) */}
              {ride.notes && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 shadow-sm space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Passenger Notes / Special Instructions</span>
                  </div>
                  <p className="text-xs text-amber-950 font-medium">"{ride.notes}"</p>
                </div>
              )}

              {/* Timing & Timeline */}
              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Trip Timeline
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                  {ride.createdAt && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>Requested: {formatDateTime(ride.createdAt)}</span>
                    </div>
                  )}
                  {(ride.driverAssignedAt || ride.acceptedAt) && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      <span>Assigned: {formatDateTime(ride.driverAssignedAt || ride.acceptedAt)}</span>
                    </div>
                  )}
                  {ride.startedAt && (
                    <div className="flex items-center gap-2">
                      <Navigation className="w-3.5 h-3.5 text-orange-500" />
                      <span>Started: {formatDateTime(ride.startedAt)}</span>
                    </div>
                  )}
                  {ride.completedAt && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Completed: {formatDateTime(ride.completedAt)}</span>
                    </div>
                  )}
                  {ride.cancelledAt && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Cancelled: {formatDateTime(ride.cancelledAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Structured Chronological Trip Timeline */}
              {timelineEvents.length > 0 && (
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Milestone className="w-3.5 h-3.5 text-[#FF5B26]" />
                    <span>Trip Activity Timeline</span>
                  </h4>

                  <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-orange-100">
                    {timelineEvents.map((ev, idx) => {
                      const evTime = ev.timestamp || ev.time || ev.createdAt;
                      return (
                        <div key={idx} className="relative text-xs">
                          <div className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-[#FF5B26] ring-4 ring-orange-100" />
                          <div className="flex items-center justify-between font-semibold text-gray-800">
                            <span>{ev.title || ev.event || ev.status || 'Trip Event'}</span>
                            <span className="text-[11px] text-gray-400 font-normal">
                              {evTime ? formatDateTime(evTime) : ''}
                            </span>
                          </div>
                          {ev.description && (
                            <p className="text-[11px] text-gray-500 mt-0.5">{ev.description}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Fare & Payment Breakdown */}
              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Payment & Fare Breakdown
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {ride.paymentMethod || 'CASH'}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      (ride.paymentStatus || '').toUpperCase() === 'PAID'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {ride.paymentStatus || 'PENDING'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600 pt-1">
                  {(ride.fare?.basePrice !== undefined || ride.fareBreakdown?.baseFare !== undefined || finalFare?.baseFare !== undefined) && (
                    <div className="flex justify-between">
                      <span>Base Fare</span>
                      <span className="font-semibold text-gray-800">
                        {formatMoney(finalFare?.baseFare ?? ride.fare?.basePrice ?? ride.fareBreakdown?.baseFare)}
                      </span>
                    </div>
                  )}
                  {(ride.fare?.distanceRate !== undefined || ride.fareBreakdown?.distanceFare !== undefined || finalFare?.distanceFare !== undefined || ride.fare?.perKmRate !== undefined) && (
                    <div className="flex justify-between">
                      <span>Distance Fare ({tripDistanceKm} km {ride.fare?.perKmRate ? `@ ${formatMoney(ride.fare.perKmRate)}/km` : ''})</span>
                      <span className="font-semibold text-gray-800">
                        {formatMoney(finalFare?.distanceFare ?? ride.fare?.distanceRate ?? ride.fareBreakdown?.distanceFare ?? (ride.fare?.perKmRate ? ride.fare.perKmRate * tripDistanceKm : 0))}
                      </span>
                    </div>
                  )}
                  {(ride.fare?.timeRate !== undefined || finalFare?.timeFare !== undefined || ride.fare?.perMinuteRate !== undefined) && (
                    <div className="flex justify-between">
                      <span>Time Fare ({tripDuration || 0} mins {ride.fare?.perMinuteRate ? `@ ${formatMoney(ride.fare.perMinuteRate)}/min` : ''})</span>
                      <span className="font-semibold text-gray-800">
                        {formatMoney(finalFare?.timeFare ?? ride.fare?.timeRate ?? (ride.fare?.perMinuteRate && tripDuration ? ride.fare.perMinuteRate * tripDuration : 0))}
                      </span>
                    </div>
                  )}
                  {(waitingCharges > 0 || (waitingMinutes !== null && waitingMinutes > 0)) && (
                    <div className="flex justify-between items-center text-amber-800 font-semibold bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-200/80">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Waiting / Delay Charges {waitingMinutes ? `(${waitingMinutes} mins)` : ''}
                      </span>
                      <span className="font-bold text-amber-900">
                        +{formatMoney(waitingCharges)}
                      </span>
                    </div>
                  )}
                  {(finalFare?.extras !== undefined || finalFare?.extraCharges !== undefined) && (
                    <div className="flex justify-between">
                      <span>Extra Charges & Tolls</span>
                      <span className="font-semibold text-gray-800">
                        {formatMoney(finalFare.extras ?? finalFare.extraCharges)}
                      </span>
                    </div>
                  )}
                  {ride.fare?.subTotal !== undefined && (
                    <div className="flex justify-between text-gray-500 pt-1 border-t border-gray-100">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-700">{formatMoney(ride.fare.subTotal)}</span>
                    </div>
                  )}
                  {(ride.fare?.discount !== undefined || finalFare?.discount !== undefined || ride.discount !== undefined || ride.promoCode) && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        Discount {ride.promoCode ? `(${ride.promoCode})` : ''}
                      </span>
                      <span className="font-semibold">
                        -{formatMoney(finalFare?.discount ?? ride.fare?.discount ?? ride.discount ?? 0)}
                      </span>
                    </div>
                  )}
                  {((ride.fare?.taxAndFees !== undefined && Number(ride.fare.taxAndFees) > 0) || (finalFare?.tax !== undefined && Number(finalFare.tax) > 0)) && (
                    <div className="flex justify-between">
                      <span>Taxes & Fees</span>
                      <span className="font-semibold text-gray-800">{formatMoney(finalFare?.tax ?? ride.fare?.taxAndFees)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Payable Fare</span>
                    <span className="text-base text-emerald-600">{formatMoney(fareTotal)}</span>
                  </div>
                  {ride.paymentCollectedAt && (
                    <p className="text-[11px] text-gray-400 text-right pt-0.5">
                      Collected at: {formatDateTime(ride.paymentCollectedAt)}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* In-Ride Chat Modal */}
      {ride && (
        <RideChatModal
          rideId={rideId || ride?.rideId || ride?._id || null}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          passengerName={passengerName}
          passengerPhone={passengerPhone}
          passengerAvatar={ride?.passenger?.avatar}
        />
      )}
    </div>
  );
}

